import { PrismaService } from '../../../prisma/prisma.service';
import { DataFiltersDto } from '../dto/create-research-request.dto';

/**
 * Estimate patient count based on filter criteria
 *
 * This function builds a Prisma query based on the provided filters
 * and returns the estimated count of patients that match the criteria.
 *
 * @param prisma - Prisma service instance
 * @param filters - Data filters from research request
 * @returns Estimated patient count
 */
export async function estimatePatientCount(
  prisma: PrismaService,
  filters: DataFiltersDto,
): Promise<number> {
  const whereClause: any = {
    isActive: true, // Only active patients
  };

  // Date range filter
  if (filters.periodStart || filters.periodEnd) {
    whereClause.createdAt = {};
    if (filters.periodStart) {
      whereClause.createdAt.gte = new Date(filters.periodStart);
    }
    if (filters.periodEnd) {
      whereClause.createdAt.lte = new Date(filters.periodEnd);
    }
  }

  // Tumor type filter
  if (filters.tumorTypes && filters.tumorTypes.length > 0) {
    whereClause.pathologyType = {
      in: filters.tumorTypes,
    };
  }

  // WHO Classification filter
  if (filters.whoClassifications && filters.whoClassifications.length > 0) {
    whereClause.OR = [
      {
        whoBoneTumorId: {
          in: filters.whoClassifications,
        },
      },
      {
        whoSoftTissueTumorId: {
          in: filters.whoClassifications,
        },
      },
    ];
  }

  // Enneking staging filter
  if (filters.ennekingStages && filters.ennekingStages.length > 0) {
    whereClause.ennekingStage = {
      in: filters.ennekingStages,
    };
  }

  // AJCC staging filter
  if (filters.ajccStages && filters.ajccStages.length > 0) {
    whereClause.ajccStage = {
      in: filters.ajccStages,
    };
  }

  // Age range filter
  if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
    const now = new Date();

    if (filters.ageMin !== undefined && filters.ageMax !== undefined) {
      // Both min and max specified
      const maxDate = new Date(now.getFullYear() - filters.ageMin, now.getMonth(), now.getDate());
      const minDate = new Date(now.getFullYear() - filters.ageMax - 1, now.getMonth(), now.getDate());

      whereClause.dateOfBirth = {
        gte: minDate,
        lte: maxDate,
      };
    } else if (filters.ageMin !== undefined) {
      // Only min age specified (e.g., >= 18 years)
      const maxDate = new Date(now.getFullYear() - filters.ageMin, now.getMonth(), now.getDate());
      whereClause.dateOfBirth = {
        lte: maxDate,
      };
    } else if (filters.ageMax !== undefined) {
      // Only max age specified (e.g., <= 40 years)
      const minDate = new Date(now.getFullYear() - filters.ageMax - 1, now.getMonth(), now.getDate());
      whereClause.dateOfBirth = {
        gte: minDate,
      };
    }
  }

  // Gender filter
  if (filters.genders && filters.genders.length > 0) {
    whereClause.gender = {
      in: filters.genders,
    };
  }

  // Center filter
  if (filters.centerIds && filters.centerIds.length > 0) {
    whereClause.centerId = {
      in: filters.centerIds,
    };
  }

  // Treatment type filter (requires join with treatment records)
  // This is more complex and might need optimization
  // For now, we'll skip this in the estimate and add it as a TODO

  try {
    const count = await prisma.patient.count({
      where: whereClause,
    });

    return count;
  } catch (error) {
    console.error('Error estimating patient count:', error);
    // Return 0 if there's an error
    return 0;
  }
}

/**
 * Validate filters and return validation errors
 */
export function validateFilters(filters: DataFiltersDto): string[] {
  const errors: string[] = [];

  // Date range validation
  if (filters.periodStart && filters.periodEnd) {
    const start = new Date(filters.periodStart);
    const end = new Date(filters.periodEnd);

    if (start > end) {
      errors.push('Period start date must be before end date');
    }

    // Check if date range is too large (e.g., more than 20 years)
    const yearDiff = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365);
    if (yearDiff > 20) {
      errors.push('Period range cannot exceed 20 years');
    }
  }

  // Age range validation
  if (filters.ageMin !== undefined && filters.ageMax !== undefined) {
    if (filters.ageMin > filters.ageMax) {
      errors.push('Minimum age cannot be greater than maximum age');
    }
  }

  return errors;
}
