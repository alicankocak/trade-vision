const fs = require('fs');
const mockAuthDataPath = 'src/data/mockAuthData.ts';
const mockDataPath = 'src/utils/mockData.ts';
const riskKutuphaneMockDataPath = 'src/data/riskKutuphaneMockData.ts';

// Add companyId to riskKutuphaneMockData
let riskData = fs.readFileSync(riskKutuphaneMockDataPath, 'utf8');
if (!riskData.includes('companyId?: string')) {
   riskData = riskData.replace('ilgiliKalem?: string;', 'ilgiliKalem?: string;\n  companyId?: string;');
   
   let idIndex = 0;
   riskData = riskData.replace(/riskKategori:/g, (match) => {
       const cid = idIndex % 2 === 0 ? 'comp_ticaret_01' : 'comp_ticaret_02';
       idIndex++;
       return `companyId: '${cid}',\n    riskKategori:`;
   });
   fs.writeFileSync(riskKutuphaneMockDataPath, riskData);
}

// Add companyId to declarationsList in mockData.ts
let mockData = fs.readFileSync(mockDataPath, 'utf8');
if (!mockData.includes('companyId: ')) {
   let dIdIndex = 0;
   mockData = mockData.replace(/buyer:/g, (match) => {
       const cid = dIdIndex % 2 === 0 ? 'comp_ticaret_01' : 'comp_ticaret_02';
       dIdIndex++;
       return `companyId: '${cid}',\n    buyer:`;
   });
   fs.writeFileSync(mockDataPath, mockData);
}
console.log('Done mapping mock data!');
