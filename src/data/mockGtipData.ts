export interface GtipUsage {
  id: string;
  gtipNo: string;
  usageCount: number;
  companyId: string;
  year: number;
}

export const mockGtipUsage: GtipUsage[] = [
  // Trendyol A.Ş. (comp_trendyol) - 2024
  { id: 'gtip_1', gtipNo: '8890.00.00.00', usageCount: 450, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_2', gtipNo: '6204.42.00.00', usageCount: 380, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_3', gtipNo: '6403.91.13.00', usageCount: 310, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_4', gtipNo: '4202.22.10.00', usageCount: 290, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_5', gtipNo: '3304.99.00.00', usageCount: 245, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_6', gtipNo: '8517.13.00.00', usageCount: 210, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_7', gtipNo: '9503.00.70.00', usageCount: 185, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_8', gtipNo: '3926.90.97.00', usageCount: 160, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_9', gtipNo: '6109.10.00.00', usageCount: 140, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_10', gtipNo: '7323.93.00.00', usageCount: 125, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_11', gtipNo: '8418.10.20.00', usageCount: 95, companyId: 'comp_trendyol', year: 2024 },
  { id: 'gtip_12', gtipNo: '8516.71.00.00', usageCount: 88, companyId: 'comp_trendyol', year: 2024 },
  
  // DCS Customs (comp_dcs) - they might see aggregate or specific ones, 
  // but usually they see their clients' data if we filter by current context.
  { id: 'gtip_d1', gtipNo: '8890.00.00.00', usageCount: 1200, companyId: 'comp_dcs', year: 2024 },
  { id: 'gtip_d2', gtipNo: '8703.23.19.00', usageCount: 950, companyId: 'comp_dcs', year: 2024 },
  { id: 'gtip_d3', gtipNo: '8471.30.00.00', usageCount: 840, companyId: 'comp_dcs', year: 2024 },
  { id: 'gtip_d4', gtipNo: '3004.90.00.00', usageCount: 720, companyId: 'comp_dcs', year: 2024 },
  { id: 'gtip_d5', gtipNo: '8517.62.00.00', usageCount: 610, companyId: 'comp_dcs', year: 2024 },
];
