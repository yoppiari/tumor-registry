import { Injectable, Logger } from '@nestjs/common';

export interface ProvinceData {
  id: string;
  name: string;
  code: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
  healthFacilities: number;
}

export interface CancerData {
  id: string;
  provinceId: string;
  cancerType: string;
  cases: number;
  year: number;
  demographic: {
    ageGroup: string;
    gender: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface AccuracyResult {
  isAccurate: boolean;
  errors: string[];
  accuracy: number;
  details: any;
}

@Injectable()
export class GeographicTestDataFactory {
  private readonly logger = new Logger(GeographicTestDataFactory.name);

  // Indonesian provinces data
  private readonly INDONESIAN_PROVINCES: ProvinceData[] = [
    { id: 'ID-ACEH', name: 'Aceh', code: 'ACEH', coordinates: { lat: 4.695135, lng: 96.749397 }, population: 5296400, healthFacilities: 156 },
    { id: 'ID-SUMUT', name: 'Sumatera Utara', code: 'SUMUT', coordinates: { lat: 2.115341, lng: 99.545097 }, population: 14834600, healthFacilities: 534 },
    { id: 'ID-SUMBAR', name: 'Sumatera Barat', code: 'SUMBAR', coordinates: { lat: -0.739921, lng: 100.800005 }, population: 5626800, healthFacilities: 289 },
    { id: 'ID-RIAU', name: 'Riau', code: 'RIAU', coordinates: { lat: 0.293347, lng: 101.706829 }, population: 6494900, healthFacilities: 267 },
    { id: 'ID-JAMBI', name: 'Jambi', code: 'JAMBI', coordinates: { lat: -1.610109, lng: 103.613129 }, population: 3576300, healthFacilities: 178 },
    { id: 'ID-SUMSEL', name: 'Sumatera Selatan', code: 'SUMSEL', coordinates: { lat: -3.319436, lng: 104.915638 }, population: 8341400, healthFacilities: 423 },
    { id: 'ID-BENGKULU', name: 'Bengkulu', code: 'BENGKULU', coordinates: { lat: -3.800452, lng: 102.252591 }, population: 2018800, healthFacilities: 134 },
    { id: 'ID-LAMPUNG', name: 'Lampung', code: 'LAMPUNG', coordinates: { lat: -4.558587, lng: 105.406807 }, population: 8044600, healthFacilities: 312 },
    { id: 'ID-DKI', name: 'DKI Jakarta', code: 'DKI', coordinates: { lat: -6.208763, lng: 106.845599 }, population: 10832200, healthFacilities: 456 },
    { id: 'ID-JABAR', name: 'Jawa Barat', code: 'JABAR', coordinates: { lat: -6.917464, lng: 107.619123 }, population: 48812100, healthFacilities: 1567 },
    { id: 'ID-JATENG', name: 'Jawa Tengah', code: 'JATENG', coordinates: { lat: -7.250445, lng: 110.175508 }, population: 36839300, healthFacilities: 1234 },
    { id: 'ID-DIY', name: 'DI Yogyakarta', code: 'DIY', coordinates: { lat: -7.795580, lng: 110.369492 }, population: 3737900, healthFacilities: 167 },
    { id: 'ID-JATIM', name: 'Jawa Timur', code: 'JATIM', coordinates: { lat: -7.536064, lng: 112.238402 }, population: 40910500, healthFacilities: 1345 },
    { id: 'ID-BANTEN', name: 'Banten', code: 'BANTEN', coordinates: { lat: -6.405817, lng: 106.064018 }, population: 12423100, healthFacilities: 389 },
    { id: 'ID-BALI', name: 'Bali', code: 'BALI', coordinates: { lat: -8.409518, lng: 115.188916 }, population: 4392900, healthFacilities: 198 },
    { id: 'ID-NTB', name: 'Nusa Tenggara Barat', code: 'NTB', coordinates: { lat: -8.652945, lng: 117.361648 }, population: 5229700, healthFacilities: 234 },
    { id: 'ID-NTT', name: 'Nusa Tenggara Timur', code: 'NTT', coordinates: { lat: -8.657382, lng: 121.079370 }, population: 5415900, healthFacilities: 189 },
    { id: 'ID-KALBAR', name: 'Kalimantan Barat', code: 'KALBAR', coordinates: { lat: 0.278781, lng: 111.475285 }, population: 4070800, healthFacilities: 156 },
    { id: 'ID-KALTENG', name: 'Kalimantan Tengah', code: 'KALTENG', coordinates: { lat: -1.682074, lng: 113.382354 }, population: 2651900, healthFacilities: 134 },
    { id: 'ID-KALSEL', name: 'Kalimantan Selatan', code: 'KALSEL', coordinates: { lat: -3.092642, lng: 115.283759 }, population: 4143400, healthFacilities: 178 },
    { id: 'ID-KALTIM', name: 'Kalimantan Timur', code: 'KALTIM', coordinates: { lat: 0.925784, lng: 116.792444 }, population: 3777600, healthFacilities: 167 },
    { id: 'ID-KALTRA', name: 'Kalimantan Utara', code: 'KALTRA', coordinates: { lat: 3.073345, lng: 115.578012 }, population: 708600, healthFacilities: 56 },
    { id: 'ID-SULSEL', name: 'Sulawesi Selatan', code: 'SULSEL', coordinates: { lat: -3.668799, lng: 119.974060 }, population: 9348800, healthFacilities: 389 },
    { id: 'ID-SULTENG', name: 'Sulawesi Tengah', code: 'SULTENG', coordinates: { lat: -1.430025, lng: 121.443034 }, population: 3102800, healthFacilities: 145 },
    { id: 'ID-SULTRA', name: 'Sulawesi Tenggara', code: 'SULTRA', coordinates: { lat: -4.149806, lng: 122.175057 }, population: 2742100, healthFacilities: 123 },
    { id: 'ID-SULBAR', name: 'Sulawesi Barat', code: 'SULBAR', coordinates: { lat: -2.844068, lng: 119.232082 }, population: 1425900, healthFacilities: 89 },
    { id: 'ID-GORO', name: 'Gorontalo', code: 'GORO', coordinates: { lat: 0.645692, lng: 123.056888 }, population: 1191200, healthFacilities: 67 },
    { id: 'ID-SULUT', name: 'Sulawesi Utara', code: 'SULUT', coordinates: { lat: 0.627034, lng: 123.428883 }, population: 2478800, healthFacilities: 134 },
    { id: 'ID-MALUKU', name: 'Maluku', code: 'MALUKU', coordinates: { lat: -3.238462, lng: 130.145266 }, population: 1787300, healthFacilities: 98 },
    { id: 'ID-MALUT', name: 'Maluku Utara', code: 'MALUT', coordinates: { lat: 1.570999, lng: 127.808769 }, population: 1314500, healthFacilities: 67 },
    { id: 'ID-PAPUA', name: 'Papua', code: 'PAPUA', coordinates: { lat: -4.269928, lng: 138.080353 }, population: 4254100, healthFacilities: 234 },
    { id: 'ID-PAPBAR', name: 'Papua Barat', code: 'PAPBAR', coordinates: { lat: -1.336115, lng: 133.240395 }, population: 1041300, healthFacilities: 89 },
  ];

  // Common cancer types in Indonesia
  private readonly CANCER_TYPES = [
    'Breast Cancer',
    'Lung Cancer',
    'Cervical Cancer',
    'Colorectal Cancer',
    'Liver Cancer',
    'Stomach Cancer',
    'Prostate Cancer',
    'Nasopharyngeal Cancer',
    'Ovarian Cancer',
    'Skin Cancer',
  ];

  /**
   * Create Indonesian provinces test data
   */
  async createIndonesianProvinceData(): Promise<ProvinceData[]> {
    try {
      // Validate coordinates for all provinces
      const validProvinces = this.INDONESIAN_PROVINCES.filter(province => {
        return this.validateCoordinates(province.coordinates.lat, province.coordinates.lng);
      });

      if (validProvinces.length !== this.INDONESIAN_PROVINCES.length) {
        this.logger.warn(`Some provinces have invalid coordinates. Valid: ${validProvinces.length}/${this.INDONESIAN_PROVINCES.length}`);
      }

      this.logger.log(`Created Indonesian provinces data: ${validProvinces.length} provinces`);
      return validProvinces;

    } catch (error) {
      this.logger.error(`Error creating province data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create cancer hotspot data for specific provinces
   */
  async createCancerHotspotData(provinces: string[]): Promise<CancerData[]> {
    try {
      const cancerData: CancerData[] = [];
      const currentYear = new Date().getFullYear();

      provinces.forEach(provinceId => {
        const province = this.INDONESIAN_PROVINCES.find(p => p.id === provinceId || p.code === provinceId);
        if (!province) {
          this.logger.warn(`Province not found: ${provinceId}`);
          return;
        }

        // Generate cancer data for the past 5 years
        for (let year = currentYear - 4; year <= currentYear; year++) {
          this.CANCER_TYPES.forEach(cancerType => {
            // Generate realistic case numbers based on province population
            const baseCases = Math.floor((province.population / 1000000) * Math.random() * 500 + 50);

            cancerData.push({
              id: `${provinceId}-${cancerType.replace(/\s+/g, '-')}-${year}`,
              provinceId: province.id,
              cancerType,
              cases: baseCases + Math.floor(Math.random() * 100),
              year,
              demographic: this.generateDemographic(),
              coordinates: province.coordinates,
            });
          });
        }
      });

      this.logger.log(`Created cancer hotspot data: ${cancerData.length} records for ${provinces.length} provinces`);
      return cancerData;

    } catch (error) {
      this.logger.error(`Error creating cancer hotspot data: ${error.message}`);
      throw error;
    }
  }

  /**
   * Validate spatial accuracy of geographic data
   */
  async validateSpatialAccuracy(geographicData: any): Promise<AccuracyResult> {
    const errors: string[] = [];
    let accuracy = 100;

    try {
      // Validate coordinates
      if (geographicData.provinces) {
        geographicData.provinces.forEach((province: ProvinceData) => {
          if (!this.validateCoordinates(province.coordinates.lat, province.coordinates.lng)) {
            errors.push(`Invalid coordinates for province: ${province.name}`);
            accuracy -= 10;
          }

          // Check if coordinates are within Indonesia bounds
          if (!this.isWithinIndonesiaBounds(province.coordinates.lat, province.coordinates.lng)) {
            errors.push(`Coordinates outside Indonesia for province: ${province.name}`);
            accuracy -= 15;
          }
        });
      }

      // Validate cancer data consistency
      if (geographicData.cancerData) {
        geographicData.cancerData.forEach((data: CancerData) => {
          if (data.cases < 0 || data.cases > 10000) {
            errors.push(`Unrealistic case count: ${data.cases} for ${data.cancerType} in ${data.provinceId}`);
            accuracy -= 5;
          }

          if (data.year < 2000 || data.year > new Date().getFullYear()) {
            errors.push(`Invalid year: ${data.year} for cancer data`);
            accuracy -= 5;
          }
        });
      }

      return {
        isAccurate: errors.length === 0 && accuracy >= 80,
        errors,
        accuracy: Math.max(0, accuracy),
        details: {
          provincesValidated: geographicData.provinces?.length || 0,
          cancerRecordsValidated: geographicData.cancerData?.length || 0,
          validationTimestamp: new Date().toISOString(),
        },
      };

    } catch (error) {
      this.logger.error(`Error validating spatial accuracy: ${error.message}`);
      return {
        isAccurate: false,
        errors: [`Validation error: ${error.message}`],
        accuracy: 0,
        details: { error: error.message },
      };
    }
  }

  /**
   * Validate aggregation accuracy for analytics
   */
  async validateAggregationAccuracy(aggregatedData: any): Promise<AccuracyResult> {
    const errors: string[] = [];
    let accuracy = 100;

    try {
      // Validate that aggregated data sums correctly
      if (aggregatedData.totalCases && aggregatedData.provinceBreakdown) {
        const calculatedTotal = aggregatedData.provinceBreakdown.reduce(
          (sum: number, province: any) => sum + province.cases,
          0
        );

        if (Math.abs(calculatedTotal - aggregatedData.totalCases) > 0.01 * aggregatedData.totalCases) {
          errors.push(`Aggregation mismatch: expected ${aggregatedData.totalCases}, calculated ${calculatedTotal}`);
          accuracy -= 20;
        }
      }

      // Validate cancer type distribution
      if (aggregatedData.cancerTypeBreakdown) {
        const totalCancerCases = aggregatedData.cancerTypeBreakdown.reduce(
          (sum: number, type: any) => sum + type.cases,
          0
        );

        if (aggregatedData.totalCases && Math.abs(totalCancerCases - aggregatedData.totalCases) > 5) {
          errors.push(`Cancer type aggregation mismatch`);
          accuracy -= 15;
        }
      }

      // Validate percentage calculations
      if (aggregatedData.percentages) {
        const totalPercentage = Object.values(aggregatedData.percentages).reduce(
          (sum: number, percentage: any) => sum + Number(percentage),
          0
        );

        if (Math.abs(totalPercentage - 100) > 0.1) {
          errors.push(`Percentage total mismatch: ${totalPercentage}%`);
          accuracy -= 10;
        }
      }

      return {
        isAccurate: errors.length === 0 && accuracy >= 90,
        errors,
        accuracy: Math.max(0, accuracy),
        details: {
          aggregationsValidated: 3,
          totalItemsValidated: aggregatedData.provinceBreakdown?.length + aggregatedData.cancerTypeBreakdown?.length,
          validationTimestamp: new Date().toISOString(),
        },
      };

    } catch (error) {
      this.logger.error(`Error validating aggregation accuracy: ${error.message}`);
      return {
        isAccurate: false,
        errors: [`Aggregation validation error: ${error.message}`],
        accuracy: 0,
        details: { error: error.message },
      };
    }
  }

  /**
   * Helper methods
   */
  private validateCoordinates(lat: number, lng: number): boolean {
    return (
      typeof lat === 'number' &&
      typeof lng === 'number' &&
      lat >= -90 && lat <= 90 &&
      lng >= -180 && lng <= 180 &&
      !isNaN(lat) && !isNaN(lng)
    );
  }

  private isWithinIndonesiaBounds(lat: number, lng: number): boolean {
    // Rough bounds for Indonesia
    return lat >= -11 && lat <= 6 && lng >= 95 && lng <= 141;
  }

  private generateDemographic(): { ageGroup: string; gender: string } {
    const ageGroups = ['0-17', '18-35', '36-50', '51-65', '65+'];
    const genders = ['Male', 'Female'];

    return {
      ageGroup: ageGroups[Math.floor(Math.random() * ageGroups.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
    };
  }
}