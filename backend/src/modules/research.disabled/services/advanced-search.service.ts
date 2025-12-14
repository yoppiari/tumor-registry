import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';
import { AdvancedSearchDto, SavedSearchDto, UpdateSavedSearchDto, BooleanOperator, SearchFieldType } from '../dto/advanced-search.dto';

@Injectable()
export class AdvancedSearchService {
  private readonly logger = new Logger(AdvancedSearchService.name);

  constructor(private prisma: PrismaService) {}

  async advancedSearch(searchDto: AdvancedSearchDto, userId: string) {
    try {
      const { page = 1, limit = 20 } = searchDto;
      const skip = (page - 1) * limit;

      // Build complex query with Boolean logic
      const where = this.buildWhereClause(searchDto);

      // Execute main search query
      const [results, total] = await Promise.all([
        this.prisma.cancerGeographicData.findMany({
          where,
          skip,
          take: limit,
          orderBy: this.buildOrderBy(searchDto),
        }),
        this.prisma.cancerGeographicData.count({ where }),
      ]);

      // Calculate relevance scores if enabled
      const scoredResults = searchDto.includeScoring
        ? results.map(result => ({
            ...result,
            relevanceScore: this.calculateRelevanceScore(result, searchDto),
          }))
        : results;

      // Generate facets if enabled
      const facets = searchDto.facetedNavigation
        ? await this.generateFacets(where, searchDto.facets)
        : null;

      return {
        results: scoredResults,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        facets,
      };
    } catch (error) {
      this.logger.error('Error performing advanced search', error);
      throw error;
    }
  }

  async saveSearch(userId: string, saveSearchDto: SavedSearchDto) {
    try {
      const savedSearch = await this.prisma.savedSearch.create({
        data: {
          userId,
          name: saveSearchDto.name,
          description: saveSearchDto.description,
          searchCriteria: saveSearchDto.searchCriteria as any,
          isPublic: saveSearchDto.isPublic || false,
          alertsEnabled: saveSearchDto.alertsEnabled || false,
          alertFrequency: saveSearchDto.alertFrequency,
        },
      });

      this.logger.log(`Saved search created: ${savedSearch.name} for user ${userId}`);
      return savedSearch;
    } catch (error) {
      this.logger.error('Error saving search', error);
      throw error;
    }
  }

  async getSavedSearches(userId: string, includePublic: boolean = true) {
    try {
      const where: any = {
        OR: [
          { userId },
          ...(includePublic ? [{ isPublic: true }] : []),
        ],
      };

      const savedSearches = await this.prisma.savedSearch.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
      });

      return savedSearches;
    } catch (error) {
      this.logger.error('Error retrieving saved searches', error);
      throw error;
    }
  }

  async getSavedSearchById(id: string, userId: string) {
    try {
      const savedSearch = await this.prisma.savedSearch.findUnique({
        where: { id },
      });

      if (!savedSearch) {
        throw new NotFoundException(`Saved search with ID ${id} not found`);
      }

      // Check access permissions
      if (savedSearch.userId !== userId && !savedSearch.isPublic) {
        throw new NotFoundException(`Saved search with ID ${id} not found`);
      }

      return savedSearch;
    } catch (error) {
      this.logger.error(`Error retrieving saved search: ${id}`, error);
      throw error;
    }
  }

  async updateSavedSearch(id: string, userId: string, updateDto: UpdateSavedSearchDto) {
    try {
      const savedSearch = await this.getSavedSearchById(id, userId);

      // Only owner can update
      if (savedSearch.userId !== userId) {
        throw new NotFoundException(`Saved search with ID ${id} not found`);
      }

      const updated = await this.prisma.savedSearch.update({
        where: { id },
        data: {
          ...(updateDto.name && { name: updateDto.name }),
          ...(updateDto.description && { description: updateDto.description }),
          ...(updateDto.searchCriteria && { searchCriteria: updateDto.searchCriteria as any }),
          ...(updateDto.isPublic !== undefined && { isPublic: updateDto.isPublic }),
          ...(updateDto.alertsEnabled !== undefined && { alertsEnabled: updateDto.alertsEnabled }),
          ...(updateDto.alertFrequency && { alertFrequency: updateDto.alertFrequency }),
          updatedAt: new Date(),
        },
      });

      this.logger.log(`Saved search updated: ${id}`);
      return updated;
    } catch (error) {
      this.logger.error(`Error updating saved search: ${id}`, error);
      throw error;
    }
  }

  async deleteSavedSearch(id: string, userId: string) {
    try {
      const savedSearch = await this.getSavedSearchById(id, userId);

      // Only owner can delete
      if (savedSearch.userId !== userId) {
        throw new NotFoundException(`Saved search with ID ${id} not found`);
      }

      await this.prisma.savedSearch.delete({
        where: { id },
      });

      this.logger.log(`Saved search deleted: ${id}`);
      return { message: 'Saved search deleted successfully' };
    } catch (error) {
      this.logger.error(`Error deleting saved search: ${id}`, error);
      throw error;
    }
  }

  async executeSavedSearch(id: string, userId: string) {
    try {
      const savedSearch = await this.getSavedSearchById(id, userId);
      const searchCriteria = savedSearch.searchCriteria as AdvancedSearchDto;

      // Execute the search
      const results = await this.advancedSearch(searchCriteria, userId);

      // Update execution statistics
      await this.prisma.savedSearch.update({
        where: { id },
        data: {
          lastExecuted: new Date(),
          executionCount: { increment: 1 },
          resultCount: results.total,
        },
      });

      return results;
    } catch (error) {
      this.logger.error(`Error executing saved search: ${id}`, error);
      throw error;
    }
  }

  private buildWhereClause(searchDto: AdvancedSearchDto): any {
    const where: any = { AND: [] };

    // Free text search across multiple fields
    if (searchDto.freeText) {
      where.AND.push({
        OR: [
          { cancerType: { contains: searchDto.freeText, mode: 'insensitive' } },
          { province: { contains: searchDto.freeText, mode: 'insensitive' } },
          { regency: { contains: searchDto.freeText, mode: 'insensitive' } },
        ],
      });
    }

    // Process criteria with Boolean operators
    if (searchDto.criteria && searchDto.criteria.length > 0) {
      const criteriaGroups = this.groupCriteriaByOperator(searchDto.criteria);

      if (criteriaGroups.AND.length > 0) {
        criteriaGroups.AND.forEach(criterion => {
          where.AND.push(this.buildCriterionClause(criterion));
        });
      }

      if (criteriaGroups.OR.length > 0) {
        where.AND.push({
          OR: criteriaGroups.OR.map(criterion => this.buildCriterionClause(criterion)),
        });
      }

      if (criteriaGroups.NOT.length > 0) {
        criteriaGroups.NOT.forEach(criterion => {
          where.AND.push({
            NOT: this.buildCriterionClause(criterion),
          });
        });
      }
    }

    // Simple filters
    if (searchDto.cancerTypes && searchDto.cancerTypes.length > 0) {
      where.AND.push({ cancerType: { in: searchDto.cancerTypes } });
    }

    if (searchDto.provinces && searchDto.provinces.length > 0) {
      where.AND.push({ province: { in: searchDto.provinces } });
    }

    if (searchDto.gender) {
      where.AND.push({ gender: searchDto.gender });
    }

    if (searchDto.ageGroups && searchDto.ageGroups.length > 0) {
      where.AND.push({ ageGroup: { in: searchDto.ageGroups } });
    }

    // Date range filter
    if (searchDto.dateFrom || searchDto.dateTo) {
      const dateFilter: any = {};
      if (searchDto.dateFrom) {
        dateFilter.gte = new Date(searchDto.dateFrom);
      }
      if (searchDto.dateTo) {
        dateFilter.lte = new Date(searchDto.dateTo);
      }
      where.AND.push({ lastUpdated: dateFilter });
    }

    // If no conditions were added, remove the AND array
    if (where.AND.length === 0) {
      delete where.AND;
    }

    return where;
  }

  private groupCriteriaByOperator(criteria: any[]) {
    return criteria.reduce(
      (groups, criterion) => {
        const operator = criterion.operator || BooleanOperator.AND;
        groups[operator].push(criterion);
        return groups;
      },
      { AND: [], OR: [], NOT: [] }
    );
  }

  private buildCriterionClause(criterion: any): any {
    const field = this.mapSearchFieldToDbField(criterion.field);
    return { [field]: { equals: criterion.value, mode: 'insensitive' } };
  }

  private mapSearchFieldToDbField(field: SearchFieldType): string {
    const mapping = {
      [SearchFieldType.CANCER_TYPE]: 'cancerType',
      [SearchFieldType.GENDER]: 'gender',
      [SearchFieldType.AGE_GROUP]: 'ageGroup',
      [SearchFieldType.STAGE]: 'stage',
      [SearchFieldType.PROVINCE]: 'province',
      [SearchFieldType.REGENCY]: 'regency',
      [SearchFieldType.DIAGNOSIS_DATE]: 'lastUpdated',
    };
    return mapping[field] || field;
  }

  private buildOrderBy(searchDto: AdvancedSearchDto): any {
    if (searchDto.sortBy === 'relevance') {
      // For relevance, we'll sort by count (higher count = more relevant)
      return { count: searchDto.sortOrder || 'desc' };
    }

    return { [searchDto.sortBy || 'lastUpdated']: searchDto.sortOrder || 'desc' };
  }

  private calculateRelevanceScore(result: any, searchDto: AdvancedSearchDto): number {
    let score = 0;

    // Base score from data quality
    score += result.dataQuality === 'EXCELLENT' ? 25 : result.dataQuality === 'GOOD' ? 20 : 15;

    // Score from completeness
    if (result.incidenceRate) score += 15;
    if (result.mortalityRate) score += 15;
    if (result.ageStandardizedRate) score += 10;

    // Score from recency (more recent = higher score)
    const currentYear = new Date().getFullYear();
    const yearDiff = currentYear - result.year;
    score += Math.max(0, 20 - yearDiff * 2);

    // Score from count (higher count = more reliable)
    score += Math.min(15, result.count / 10);

    // Match score for search criteria
    if (searchDto.freeText) {
      const text = searchDto.freeText.toLowerCase();
      if (result.cancerType?.toLowerCase().includes(text)) score += 10;
      if (result.province?.toLowerCase().includes(text)) score += 5;
    }

    return Math.min(100, Math.round(score));
  }

  private async generateFacets(where: any, facetFields?: string[]): Promise<any> {
    const defaultFacets = ['cancerType', 'province', 'gender', 'ageGroup', 'stage'];
    const fields = facetFields || defaultFacets;

    const facets: any = {};

    for (const field of fields) {
      try {
        const groupBy = await this.prisma.cancerGeographicData.groupBy({
          by: [field as any],
          where,
          _count: true,
          orderBy: {
            _count: {
              [field]: 'desc',
            },
          },
          take: 20, // Top 20 facets per field
        });

        facets[field] = groupBy.map((item: any) => ({
          value: item[field],
          count: item._count,
        }));
      } catch (error) {
        // Some fields might not support groupBy, skip them
        this.logger.warn(`Could not generate facet for field: ${field}`);
      }
    }

    return facets;
  }

  async getSearchSuggestions(partialQuery: string, field: SearchFieldType): Promise<string[]> {
    try {
      const dbField = this.mapSearchFieldToDbField(field);

      const results = await this.prisma.cancerGeographicData.findMany({
        where: {
          [dbField]: {
            contains: partialQuery,
            mode: 'insensitive',
          },
        },
        select: {
          [dbField]: true,
        },
        distinct: [dbField as any],
        take: 10,
      });

      return results.map(r => r[dbField]).filter(Boolean);
    } catch (error) {
      this.logger.error('Error getting search suggestions', error);
      return [];
    }
  }
}
