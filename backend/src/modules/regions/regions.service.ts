import { Injectable } from '@nestjs/common';
import { Province, Regency, District, Village } from './entities/region.entity';

@Injectable()
export class RegionsService {
  // Indonesian Provinces (34 provinces)
  private readonly provinces: Province[] = [
    { id: '1', code: '11', name: 'Aceh' },
    { id: '2', code: '12', name: 'Sumatera Utara' },
    { id: '3', code: '13', name: 'Sumatera Barat' },
    { id: '4', code: '14', name: 'Riau' },
    { id: '5', code: '15', name: 'Jambi' },
    { id: '6', code: '16', name: 'Sumatera Selatan' },
    { id: '7', code: '17', name: 'Bengkulu' },
    { id: '8', code: '18', name: 'Lampung' },
    { id: '9', code: '19', name: 'Kepulauan Bangka Belitung' },
    { id: '10', code: '21', name: 'Kepulauan Riau' },
    { id: '11', code: '31', name: 'DKI Jakarta' },
    { id: '12', code: '32', name: 'Jawa Barat' },
    { id: '13', code: '33', name: 'Jawa Tengah' },
    { id: '14', code: '34', name: 'DI Yogyakarta' },
    { id: '15', code: '35', name: 'Jawa Timur' },
    { id: '16', code: '36', name: 'Banten' },
    { id: '17', code: '51', name: 'Bali' },
    { id: '18', code: '52', name: 'Nusa Tenggara Barat' },
    { id: '19', code: '53', name: 'Nusa Tenggara Timur' },
    { id: '20', code: '61', name: 'Kalimantan Barat' },
    { id: '21', code: '62', name: 'Kalimantan Tengah' },
    { id: '22', code: '63', name: 'Kalimantan Selatan' },
    { id: '23', code: '64', name: 'Kalimantan Timur' },
    { id: '24', code: '65', name: 'Kalimantan Utara' },
    { id: '25', code: '71', name: 'Sulawesi Utara' },
    { id: '26', code: '72', name: 'Sulawesi Tengah' },
    { id: '27', code: '73', name: 'Sulawesi Selatan' },
    { id: '28', code: '74', name: 'Sulawesi Tenggara' },
    { id: '29', code: '75', name: 'Gorontalo' },
    { id: '30', code: '76', name: 'Sulawesi Barat' },
    { id: '31', code: '81', name: 'Maluku' },
    { id: '32', code: '82', name: 'Maluku Utara' },
    { id: '33', code: '91', name: 'Papua' },
    { id: '34', code: '92', name: 'Papua Barat' },
  ];

  // Sample regencies (Kabupaten/Kota) - In production, this would be from database
  private readonly regencies: Regency[] = [
    // DKI Jakarta (id: 11)
    { id: '11-1', code: '3171', name: 'Jakarta Pusat', provinceId: '11', type: 'KOTA' },
    { id: '11-2', code: '3172', name: 'Jakarta Utara', provinceId: '11', type: 'KOTA' },
    { id: '11-3', code: '3173', name: 'Jakarta Barat', provinceId: '11', type: 'KOTA' },
    { id: '11-4', code: '3174', name: 'Jakarta Selatan', provinceId: '11', type: 'KOTA' },
    { id: '11-5', code: '3175', name: 'Jakarta Timur', provinceId: '11', type: 'KOTA' },

    // Jawa Barat (id: 12)
    { id: '12-1', code: '3201', name: 'Kabupaten Bogor', provinceId: '12', type: 'KABUPATEN' },
    { id: '12-2', code: '3273', name: 'Kota Bandung', provinceId: '12', type: 'KOTA' },
    { id: '12-3', code: '3275', name: 'Kota Bekasi', provinceId: '12', type: 'KOTA' },
    { id: '12-4', code: '3276', name: 'Kota Depok', provinceId: '12', type: 'KOTA' },

    // Jawa Tengah (id: 13)
    { id: '13-1', code: '3371', name: 'Kota Semarang', provinceId: '13', type: 'KOTA' },
    { id: '13-2', code: '3372', name: 'Kota Surakarta', provinceId: '13', type: 'KOTA' },
    { id: '13-3', code: '3302', name: 'Kabupaten Banyumas', provinceId: '13', type: 'KABUPATEN' },

    // Jawa Timur (id: 15)
    { id: '15-1', code: '3578', name: 'Kota Surabaya', provinceId: '15', type: 'KOTA' },
    { id: '15-2', code: '3579', name: 'Kota Malang', provinceId: '15', type: 'KOTA' },
    { id: '15-3', code: '3501', name: 'Kabupaten Pacitan', provinceId: '15', type: 'KABUPATEN' },
  ];

  // Sample districts (Kecamatan)
  private readonly districts: District[] = [
    // Jakarta Pusat
    { id: '11-1-1', code: '317101', name: 'Gambir', regencyId: '11-1' },
    { id: '11-1-2', code: '317102', name: 'Tanah Abang', regencyId: '11-1' },
    { id: '11-1-3', code: '317103', name: 'Menteng', regencyId: '11-1' },

    // Kota Bandung
    { id: '12-2-1', code: '327301', name: 'Bandung Wetan', regencyId: '12-2' },
    { id: '12-2-2', code: '327302', name: 'Sumur Bandung', regencyId: '12-2' },
    { id: '12-2-3', code: '327303', name: 'Cibeunying Kaler', regencyId: '12-2' },

    // Kota Surabaya
    { id: '15-1-1', code: '357801', name: 'Gubeng', regencyId: '15-1' },
    { id: '15-1-2', code: '357802', name: 'Tegalsari', regencyId: '15-1' },
    { id: '15-1-3', code: '357803', name: 'Genteng', regencyId: '15-1' },
  ];

  // Sample villages (Kelurahan/Desa)
  private readonly villages: Village[] = [
    // Gambir, Jakarta Pusat
    { id: '11-1-1-1', code: '31710101', name: 'Gambir', districtId: '11-1-1', type: 'KELURAHAN' },
    { id: '11-1-1-2', code: '31710102', name: 'Cideng', districtId: '11-1-1', type: 'KELURAHAN' },
    { id: '11-1-1-3', code: '31710103', name: 'Petojo Utara', districtId: '11-1-1', type: 'KELURAHAN' },

    // Bandung Wetan, Kota Bandung
    { id: '12-2-1-1', code: '32730101', name: 'Citarum', districtId: '12-2-1', type: 'KELURAHAN' },
    { id: '12-2-1-2', code: '32730102', name: 'Tamansari', districtId: '12-2-1', type: 'KELURAHAN' },

    // Gubeng, Surabaya
    { id: '15-1-1-1', code: '35780101', name: 'Gubeng', districtId: '15-1-1', type: 'KELURAHAN' },
    { id: '15-1-1-2', code: '35780102', name: 'Airlangga', districtId: '15-1-1', type: 'KELURAHAN' },
  ];

  /**
   * Get all provinces
   */
  async findAllProvinces(): Promise<Province[]> {
    return this.provinces;
  }

  /**
   * Get province by ID
   */
  async findProvinceById(id: string): Promise<Province | null> {
    return this.provinces.find(p => p.id === id) || null;
  }

  /**
   * Get regencies by province ID
   */
  async findRegenciesByProvinceId(provinceId: string): Promise<Regency[]> {
    // For provinces without sample data, generate generic regencies
    const existingRegencies = this.regencies.filter(r => r.provinceId === provinceId);

    if (existingRegencies.length > 0) {
      return existingRegencies;
    }

    // Generate generic regencies for provinces without data
    const province = await this.findProvinceById(provinceId);
    if (!province) return [];

    const provinceName = province.name.split(' ').pop() || province.name;
    return [
      {
        id: `${provinceId}-1`,
        code: `${province.code}01`,
        name: `Kota ${provinceName}`,
        provinceId,
        type: 'KOTA'
      },
      {
        id: `${provinceId}-2`,
        code: `${province.code}02`,
        name: `Kabupaten ${province.name} Utara`,
        provinceId,
        type: 'KABUPATEN'
      },
      {
        id: `${provinceId}-3`,
        code: `${province.code}03`,
        name: `Kabupaten ${province.name} Selatan`,
        provinceId,
        type: 'KABUPATEN'
      },
    ];
  }

  /**
   * Get districts by regency ID
   */
  async findDistrictsByRegencyId(regencyId: string): Promise<District[]> {
    const existingDistricts = this.districts.filter(d => d.regencyId === regencyId);

    if (existingDistricts.length > 0) {
      return existingDistricts;
    }

    // Generate generic districts
    return [
      { id: `${regencyId}-1`, code: `${regencyId}01`, name: 'Kecamatan Pusat', regencyId },
      { id: `${regencyId}-2`, code: `${regencyId}02`, name: 'Kecamatan Timur', regencyId },
      { id: `${regencyId}-3`, code: `${regencyId}03`, name: 'Kecamatan Barat', regencyId },
    ];
  }

  /**
   * Get villages by district ID
   */
  async findVillagesByDistrictId(districtId: string): Promise<Village[]> {
    const existingVillages = this.villages.filter(v => v.districtId === districtId);

    if (existingVillages.length > 0) {
      return existingVillages;
    }

    // Generate generic villages
    return [
      { id: `${districtId}-1`, code: `${districtId}01`, name: 'Kelurahan Satu', districtId, type: 'KELURAHAN' },
      { id: `${districtId}-2`, code: `${districtId}02`, name: 'Kelurahan Dua', districtId, type: 'KELURAHAN' },
      { id: `${districtId}-3`, code: `${districtId}03`, name: 'Desa Tiga', districtId, type: 'DESA' },
    ];
  }
}
