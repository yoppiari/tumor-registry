/**
 * Region Entities - Indonesian Administrative Divisions
 *
 * Hierarchy:
 * - Province (Provinsi)
 * - Regency (Kabupaten/Kota)
 * - District (Kecamatan)
 * - Village (Kelurahan/Desa)
 */

export interface Province {
  id: string;
  code: string;
  name: string;
}

export interface Regency {
  id: string;
  code: string;
  name: string;
  provinceId: string;
  type: 'KABUPATEN' | 'KOTA';
}

export interface District {
  id: string;
  code: string;
  name: string;
  regencyId: string;
}

export interface Village {
  id: string;
  code: string;
  name: string;
  districtId: string;
  type: 'KELURAHAN' | 'DESA';
}
