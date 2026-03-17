const fs = require('fs');
const mockDataPath = 'src/utils/mockData.ts';
const riskKutuphaneMockDataPath = 'src/data/riskKutuphaneMockData.ts';

// Update mockData.ts
let mockData = fs.readFileSync(mockDataPath, 'utf8');
mockData = mockData.replace(/companyId: 'comp_ticaret_01'/g, "companyId: 'comp_trendyol'");
mockData = mockData.replace(/companyId: 'comp_ticaret_02'/g, "companyId: 'comp_trendyol'");
fs.writeFileSync(mockDataPath, mockData);

// Update riskKutuphaneMockData.ts
let riskData = fs.readFileSync(riskKutuphaneMockDataPath, 'utf8');
riskData = riskData.replace(/companyId: 'comp_ticaret_01'/g, "companyId: 'comp_trendyol'");
riskData = riskData.replace(/companyId: 'comp_ticaret_02'/g, "companyId: 'comp_trendyol'");
fs.writeFileSync(riskKutuphaneMockDataPath, riskData);

console.log('Fixed company IDs to comp_trendyol!');
