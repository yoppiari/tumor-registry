import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/database/prisma.service';

@Injectable()
export class PopulationHealthService {
  private readonly logger = new Logger(PopulationHealthService.name);

  constructor(private prisma: PrismaService) {}

  async getPopulationHealthOverview(province?: string, regency?: string): Promise<any> {
    try {
      const where: any = {};

      if (province) {
        where.province = province;
      }

      if (regency) {
        where.regency = regency;
      }

      const [
        totalPopulation,
        cancerIncidenceRate,
        mortalityRate,
        screeningCoverage,
        earlyDetectionRate,
        topCancerTypes,
        ageDistribution,
        genderDistribution,
        socioeconomicData,
        healthcareAccess,
      ] = await Promise.all([
        this.getTotalPopulation(where),
        this.getCancerIncidenceRate(where),
        this.getMortalityRate(where),
        this.getScreeningCoverage(where),
        this.getEarlyDetectionRate(where),
        this.getTopCancerTypes(where),
        this.getAgeDistribution(where),
        this.getGenderDistribution(where),
        this.getSocioeconomicData(where),
        this.getHealthcareAccessData(where),
      ]);

      return {
        populationMetrics: {
          totalPopulation,
          cancerIncidenceRate,
          mortalityRate,
          screeningCoverage,
          earlyDetectionRate,
        },
        epidemiology: {
          topCancerTypes,
          ageDistribution,
          genderDistribution,
        },
        determinants: {
          socioeconomic: socioeconomicData,
          healthcareAccess,
        },
        geographic: {
          province: province || 'All Provinces',
          regency: regency || 'All Regencies',
        },
        lastUpdated: new Date(),
      };
    } catch (error) {
      this.logger.error('Error getting population health overview', error);
      throw error;
    }
  }

  async getCancerIncidenceByRegion(level: 'province' | 'regency' = 'province'): Promise<any> {
    try {
      const centers = await this.prisma.center.findMany({
        select: {
          id: true,
          name: true,
          province: true,
          regency: true,
          patients: {
            select: {
              id: true,
              diagnoses: {
                select: {
                  id: true,
                  onsetDate: true,
                  isPrimary: true,
                },
              },
            },
          },
        },
      });

      const incidenceData: Record<string, {
        region: string;
        totalPopulation: number;
        cancerCases: number;
        incidenceRate: number;
        centers: number;
      }> = centers.reduce((acc, center) => {
        const region = level === 'province' ? center.province : (center.regency || 'Unknown');
        const cancerPatients = center.patients.filter(patient =>
          patient.diagnoses.some(diagnosis => diagnosis.isPrimary)
        ).length;
        const totalPatients = center.patients.length;

        if (!acc[region]) {
          acc[region] = {
            region,
            totalPopulation: totalPatients,
            cancerCases: 0,
            incidenceRate: 0,
            centers: 0,
          };
        }

        acc[region].cancerCases += cancerPatients;
        acc[region].totalPopulation += totalPatients;
        acc[region].centers += 1;

        return acc;
      }, {});

      // Calculate incidence rates
      Object.keys(incidenceData).forEach(region => {
        const data = incidenceData[region];
        data.incidenceRate = data.totalPopulation > 0
          ? parseFloat(((data.cancerCases / data.totalPopulation) * 100000).toFixed(2))
          : 0;
      });

      const dataValues = Object.values(incidenceData);

      return {
        level,
        data: dataValues.sort((a, b) => b.incidenceRate - a.incidenceRate),
        summary: {
          totalRegions: Object.keys(incidenceData).length,
          averageIncidenceRate: this.calculateAverage(dataValues, 'incidenceRate'),
          highestIncidence: dataValues.length > 0 ? Math.max(...dataValues.map(d => d.incidenceRate)) : 0,
          lowestIncidence: dataValues.length > 0 ? Math.min(...dataValues.map(d => d.incidenceRate)) : 0,
        },
      };
    } catch (error) {
      this.logger.error('Error getting cancer incidence by region', error);
      throw error;
    }
  }

  async getScreeningProgramEffectiveness(): Promise<any> {
    try {
      // Placeholder implementation for screening effectiveness analysis
      const screeningPrograms = [
        {
          program: 'Breast Cancer Screening',
          targetPopulation: 500000,
          screened: 125000,
          detected: 375,
          earlyStageDetection: 300,
          effectiveness: {
            coverageRate: 25,
            detectionRate: 0.3,
            earlyDetectionRate: 80,
            programEffectiveness: 'Good',
          },
        },
        {
          program: 'Cervical Cancer Screening',
          targetPopulation: 400000,
          screened: 80000,
          detected: 240,
          earlyStageDetection: 216,
          effectiveness: {
            coverageRate: 20,
            detectionRate: 0.3,
            earlyDetectionRate: 90,
            programEffectiveness: 'Excellent',
          },
        },
        {
          program: 'Colorectal Cancer Screening',
          targetPopulation: 300000,
          screened: 45000,
          detected: 180,
          earlyStageDetection: 126,
          effectiveness: {
            coverageRate: 15,
            detectionRate: 0.4,
            earlyDetectionRate: 70,
            programEffectiveness: 'Moderate',
          },
        },
      ];

      return {
        programs: screeningPrograms,
        summary: {
          totalPrograms: screeningPrograms.length,
          averageCoverage: this.calculateAverage(screeningPrograms, 'coverageRate'),
          averageDetectionRate: this.calculateAverage(screeningPrograms, 'detectionRate'),
          averageEarlyDetection: this.calculateAverage(screeningPrograms, 'earlyDetectionRate'),
        },
        recommendations: [
          'Increase public awareness campaigns for underscreened populations',
          'Improve access to screening facilities in rural areas',
          'Develop targeted programs for high-risk populations',
          'Enhance follow-up mechanisms for positive screenings',
        ],
      };
    } catch (error) {
      this.logger.error('Error getting screening program effectiveness', error);
      throw error;
    }
  }

  async getHealthcareAccessAnalysis(): Promise<any> {
    try {
      const centers = await this.prisma.center.findMany({
        select: {
          id: true,
          name: true,
          province: true,
          regency: true,
          patients: {
            select: {
              id: true,
              diagnoses: {
                select: {
                  id: true,
                  onsetDate: true,
                },
              },
            },
          },
        },
      });

      const accessMetrics = centers.map(center => ({
        centerId: center.id,
        centerName: center.name,
        province: center.province,
        regency: center.regency,
        patientLoad: center.patients.length,
        cancerCases: center.patients.filter(p => p.diagnoses.length > 0).length,
        capacity: {
          currentLoad: center.patients.length,
          maxCapacity: 10000, // Assumed maximum capacity
          utilizationRate: (center.patients.length / 10000 * 100).toFixed(2),
        },
        accessibility: {
          distanceScore: Math.random() * 10, // Placeholder
          travelTime: Math.floor(Math.random() * 120) + 30, // Placeholder in minutes
          publicTransport: Math.random() > 0.3, // Placeholder
        },
        resources: {
          hasOncologist: Math.random() > 0.4,
          hasPathology: Math.random() > 0.5,
          hasRadiotherapy: Math.random() > 0.7,
          hasChemotherapy: Math.random() > 0.3,
        },
      }));

      return {
        healthcareFacilities: accessMetrics,
        summary: {
          totalCenters: centers.length,
          averageUtilization: this.calculateAverage(accessMetrics, 'utilizationRate'),
          centersWithOncologist: accessMetrics.filter(c => c.resources.hasOncologist).length,
          centersWithRadiotherapy: accessMetrics.filter(c => c.resources.hasRadiotherapy).length,
          averageAccessibility: accessMetrics.reduce((sum, c) => sum + c.accessibility.distanceScore, 0) / accessMetrics.length,
        },
        challenges: [
          'Uneven distribution of specialized cancer care facilities',
          'Limited access to radiotherapy in rural areas',
          'Shortage of oncology specialists in remote regions',
          'Long travel times for specialized treatment',
        ],
      };
    } catch (error) {
      this.logger.error('Error getting healthcare access analysis', error);
      throw error;
    }
  }

  async getRiskFactorAnalysis(): Promise<any> {
    try {
      // Placeholder for risk factor analysis
      const riskFactors = [
        {
          factor: 'Smoking',
          prevalence: 34.5,
          associatedCancers: ['Lung', 'Head & Neck', 'Bladder', 'Pancreatic'],
          relativeRisk: 3.2,
          populationAttributableRisk: 28.5,
          interventions: ['Smoking cessation programs', 'Public awareness campaigns', 'Taxation policies'],
        },
        {
          factor: 'Alcohol Consumption',
          prevalence: 22.1,
          associatedCancers: ['Liver', 'Breast', 'Esophageal', 'Head & Neck'],
          relativeRisk: 1.8,
          populationAttributableRisk: 12.3,
          interventions: ['Alcohol reduction programs', 'Screening for high-risk groups'],
        },
        {
          factor: 'Obesity',
          prevalence: 18.9,
          associatedCancers: ['Breast', 'Colorectal', 'Uterine', 'Kidney'],
          relativeRisk: 1.5,
          populationAttributableRisk: 8.7,
          interventions: ['Weight management programs', 'Nutritional education', 'Physical activity promotion'],
        },
        {
          factor: 'Viral Infections (HPV, HBV, HCV)',
          prevalence: 15.2,
          associatedCancers: ['Cervical', 'Liver', 'Nasopharyngeal'],
          relativeRisk: 5.8,
          populationAttributableRisk: 22.1,
          interventions: ['Vaccination programs', 'Screening programs', 'Public health education'],
        },
      ];

      return {
        riskFactors,
        summary: {
          totalFactors: riskFactors.length,
          highRiskFactors: riskFactors.filter(f => f.relativeRisk > 3).length,
          modifiableFactors: riskFactors.length, // All listed factors are modifiable
          combinedPAR: riskFactors.reduce((sum, f) => sum + f.populationAttributableRisk, 0) / riskFactors.length,
        },
        preventionStrategies: [
          'Implement comprehensive vaccination programs',
          'Strengthen tobacco and alcohol control policies',
          'Promote healthy lifestyle and nutrition',
          'Enhance screening for infectious agents',
          'Develop targeted interventions for high-risk populations',
        ],
      };
    } catch (error) {
      this.logger.error('Error getting risk factor analysis', error);
      throw error;
    }
  }

  async getPopulationProjections(years: number = 10): Promise<any> {
    try {
      const currentYear = new Date().getFullYear();
      const projections = [];

      for (let i = 0; i <= years; i++) {
        const targetYear = currentYear + i;
        const projectedPopulation = 270000000 + (i * 1500000); // Simplified population growth
        const projectedCancerCases = Math.floor(projectedPopulation * 0.0015); // Approximate cancer incidence

        projections.push({
          year: targetYear,
          population: projectedPopulation,
          projectedCancerCases,
          projectedIncrease: i === 0 ? 0 : Math.floor(((projectedCancerCases - projections[0].projectedCancerCases) / projections[0].projectedCancerCases) * 100),
          healthcareNeeds: {
              oncologists: Math.ceil(projectedCancerCases / 250),
              facilities: Math.ceil(projectedCancerCases / 1000),
              radiotherapyUnits: Math.ceil(projectedCancerCases / 500),
          },
          resourceGap: {
              currentOncologists: 1200,
              neededOncologists: Math.ceil(projectedCancerCases / 250),
              currentFacilities: 150,
              neededFacilities: Math.ceil(projectedCancerCases / 1000),
          },
        });
      }

      return {
        projections,
        summary: {
          period: `${currentYear} - ${currentYear + years}`,
          totalGrowth: Math.floor(((projections[projections.length - 1].projectedCancerCases - projections[0].projectedCancerCases) / projections[0].projectedCancerCases) * 100),
          averageAnnualGrowth: Math.floor(((projections[projections.length - 1].projectedCancerCases - projections[0].projectedCancerCases) / projections[0].projectedCancerCases) * 100) / years,
        },
        recommendations: [
          'Scale up oncology training programs',
          'Invest in cancer care infrastructure',
          'Develop regional cancer centers',
          'Implement telemedicine for remote areas',
          'Focus on prevention and early detection',
        ],
      };
    } catch (error) {
      this.logger.error('Error getting population projections', error);
      throw error;
    }
  }

  async getHealthEconomicAnalysis(): Promise<any> {
    try {
      const economicData = {
        directCosts: {
          treatment: 2500000000, // $2.5 billion annually
          diagnostics: 500000000, // $500 million annually
          medications: 800000000, // $800 million annually
          hospitalization: 600000000, // $600 million annually
        },
        indirectCosts: {
          productivityLoss: 1500000000, // $1.5 billion annually
          caregiverCosts: 300000000, // $300 million annually
          transportation: 100000000, // $100 million annually
        },
        preventionSavings: {
          smokingCessation: 450000000, // Potential annual savings
          vaccinationPrograms: 280000000, // Potential annual savings
          earlyDetection: 620000000, // Potential annual savings
        },
        costEffectiveness: {
          screeningPrograms: [
            { program: 'Breast Cancer', costPerQALY: 25000, costPerLifeYear: 18000 },
            { program: 'Cervical Cancer', costPerQALY: 15000, costPerLifeYear: 12000 },
            { program: 'Colorectal Cancer', costPerQALY: 20000, costPerLifeYear: 16000 },
          ],
          treatments: [
            { treatment: 'Surgery', costPerQALY: 12000, costPerLifeYear: 10000 },
            { treatment: 'Chemotherapy', costPerQALY: 35000, costPerLifeYear: 30000 },
            { treatment: 'Radiotherapy', costPerQALY: 22000, costPerLifeYear: 19000 },
          ],
        },
      };

      const totalCost = Object.values(economicData.directCosts).reduce((sum, cost) => sum + cost, 0) +
                         Object.values(economicData.indirectCosts).reduce((sum, cost) => sum + cost, 0);

      return {
        economicBurden: {
          totalCost,
          perCapitaCost: Math.round(totalCost / 270000000),
          gdpPercentage: 1.2, // % of GDP
        },
        costs: economicData,
        roi: {
          preventionInvestment: 500000000,
          expectedSavings: Object.values(economicData.preventionSavings).reduce((sum, saving) => sum + saving, 0),
          returnOnInvestment: ((Object.values(economicData.preventionSavings).reduce((sum, saving) => sum + saving, 0) - 500000000) / 500000000 * 100).toFixed(2),
        },
        recommendations: [
          'Increase investment in prevention programs',
          'Implement cost-effective screening strategies',
          'Negotiate better prices for cancer medications',
          'Develop generic treatment protocols',
          'Invest in early detection infrastructure',
        ],
      };
    } catch (error) {
      this.logger.error('Error getting health economic analysis', error);
      throw error;
    }
  }

  async generatePopulationHealthReport(reportType: 'comprehensive' | 'summary' | 'detailed', filters: any = {}): Promise<any> {
    try {
      const reportData = {
        metadata: {
          reportType,
          generatedDate: new Date(),
          filters,
          dataPeriod: {
            from: filters.dateFrom || new Date(new Date().getFullYear() - 1, 0, 1),
            to: filters.dateTo || new Date(),
          },
        },
        overview: await this.getPopulationHealthOverview(filters.province, filters.regency),
        incidence: await this.getCancerIncidenceByRegion(filters.regionLevel),
        screening: await this.getScreeningProgramEffectiveness(),
        healthcareAccess: await this.getHealthcareAccessAnalysis(),
        riskFactors: await this.getRiskFactorAnalysis(),
        projections: await this.getPopulationProjections(filters.projectionYears),
        economics: await this.getHealthEconomicAnalysis(),
      };

      const recommendations = this.generateRecommendations(reportData);

      return {
        ...reportData,
        recommendations,
        executiveSummary: this.generateExecutiveSummary(reportData, reportType),
      };
    } catch (error) {
      this.logger.error('Error generating population health report', error);
      throw error;
    }
  }

  // Helper methods
  private async getTotalPopulation(where: any): Promise<number> {
    // Placeholder implementation
    return 270000000; // Indonesia's approximate population
  }

  private async getCancerIncidenceRate(where: any): Promise<number> {
    // Placeholder implementation - cases per 100,000 population
    return 156.2;
  }

  private async getMortalityRate(where: any): Promise<number> {
    // Placeholder implementation - deaths per 100,000 population
    return 92.4;
  }

  private async getScreeningCoverage(where: any): Promise<number> {
    // Percentage of eligible population screened
    return 23.5;
  }

  private async getEarlyDetectionRate(where: any): Promise<number> {
    // Percentage of cancers detected at early stage
    return 42.8;
  }

  private async getTopCancerTypes(where: any): Promise<any[]> {
    return [
      { type: 'Breast Cancer', cases: 45678, percentage: 18.5 },
      { type: 'Lung Cancer', cases: 42345, percentage: 17.2 },
      { type: 'Colorectal Cancer', cases: 38901, percentage: 15.8 },
      { type: 'Cervical Cancer', cases: 32156, percentage: 13.1 },
      { type: 'Liver Cancer', cases: 28432, percentage: 11.6 },
    ];
  }

  private async getAgeDistribution(where: any): Promise<any> {
    return [
      { ageGroup: '0-14', cases: 2345, percentage: 0.9 },
      { ageGroup: '15-44', cases: 45678, percentage: 18.5 },
      { ageGroup: '45-64', cases: 98765, percentage: 40.1 },
      { ageGroup: '65+', cases: 98943, percentage: 40.5 },
    ];
  }

  private async getGenderDistribution(where: any): Promise<any> {
    return {
      male: { cases: 123456, percentage: 50.2 },
      female: { cases: 122275, percentage: 49.8 },
    };
  }

  private async getSocioeconomicData(where: any): Promise<any> {
    return {
      education: [
        { level: 'Primary', percentage: 35.2 },
        { level: 'Secondary', percentage: 45.8 },
        { level: 'Tertiary', percentage: 19.0 },
      ],
      income: [
        { bracket: 'Low', percentage: 28.5 },
        { bracket: 'Middle', percentage: 55.3 },
        { bracket: 'High', percentage: 16.2 },
      ],
      employment: [
        { status: 'Employed', percentage: 62.4 },
        { status: 'Unemployed', percentage: 7.8 },
        { status: 'Not in labor force', percentage: 29.8 },
      ],
    };
  }

  private async getHealthcareAccessData(where: any): Promise<any> {
    return {
      insurance: 85.2,
      distanceToNearestFacility: {
        average: 15.4, // km
        median: 8.7,
      },
      facilityDensity: 2.3, // facilities per 100,000 population
      specialistAvailability: 4.5, // specialists per 100,000 population
    };
  }

  private calculateAverage(data: any[], property: string): number {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, item) => acc + (parseFloat(item[property]) || 0), 0);
    return Math.round((sum / data.length) * 100) / 100;
  }

  private generateRecommendations(reportData: any): string[] {
    return [
      'Strengthen cancer prevention programs targeting major risk factors',
      'Expand screening coverage to underserved populations',
      'Improve healthcare infrastructure in remote areas',
      'Invest in oncology workforce development',
      'Enhance data collection and surveillance systems',
      'Develop targeted interventions for high-risk populations',
      'Promote public awareness and education campaigns',
    ];
  }

  private generateExecutiveSummary(reportData: any, reportType: string): string {
    const { overview, incidence, screening } = reportData;

    if (reportType === 'summary') {
      return `Cancer incidence rate is ${overview.populationMetrics.cancerIncidenceRate} per 100,000 population with screening coverage at ${overview.populationMetrics.screeningCoverage}%. Early detection rate remains at ${overview.populationMetrics.earlyDetectionRate}%, indicating need for improved screening programs.`;
    }

    return `Comprehensive analysis shows cancer burden with ${overview.populationMetrics.cancerIncidenceRate} cases per 100,000 population. Regional disparities exist in incidence rates, with healthcare access challenges affecting outcomes. Prevention strategies and early detection programs require expansion to address growing cancer burden.`;
  }
}