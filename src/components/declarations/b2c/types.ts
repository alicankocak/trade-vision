
export interface RiskFinding {
    id: string;
    severity: 'critical' | 'warning' | 'info';
    message: string;
    category: string;
    description?: string;
    relatedItem?: string; // e.g. "2025ARK75798 / Kalem 1"
}

export interface HAWBItem {
    id: string;
    hawbNo: string;
    sequenceNo: string;
    buyer: string; // Alıcı Firma
    consignor: string; // Gönderen Firma (renamed from consignee for clarity, or kept as is? Let's keep existing and add comments or map properly)
    // Actually, let's stick to the requested names in the View, but for the interface:
    sender: string; // Gönderen Firma
    receiver: string; // Alıcı Firma (was buyer)

    // Previous fields mapping check:
    // buyer -> receiver
    // consignee -> sender
    // keeping old names to avoid breaking other views? GroupedView uses buyer/consignee.
    // I will add new fields or aliases to avoid breakage, or just update GroupedView too.
    // Let's keep `buyer` and `consignee` but map them to Alıcı/Gönderen in FlatView.
    // Wait, let's just add the specific requested fields.

    // Requested fields mapping:
    // 1. hawbNo -> hawbNo
    // 2. sequenceNo (New)
    // 3. senderCompany (New/Existing mapped)
    // 4. receiverCompany (New/Existing mapped)
    // 5. packageCount -> pieces
    // 6. grossWeight -> weight
    // 7. packageType (New)
    // 8. senderTaxId (New)
    // 9. tradingCountry (New)
    // 10. destinationCountry (New)
    // 11. departureCountry (New)
    // 12. origin (New)
    // 13. gtip (New)
    // 14. itemDescription -> description
    // 15. netWeight (New)
    // 16. regime (New)
    // 17. fullMeasurement (New)
    // 18. currency -> currency
    // 19. invoiceAmount -> value
    // 20. euroAmount (New)

    // Existing fields
    weight: number;
    value: number;
    currency: string;
    pieces: number;
    description: string;
    status: 'Cleared' | 'Pending' | 'Risk';
    riskScore: number;
    findings: RiskFinding[];

    // New Fields
    senderCompany: string;
    receiverCompany: string;
    packageType: string;
    senderTaxId: string;
    tradingCountry: string;
    destinationCountry: string;
    departureCountry: string;
    origin: string;
    gtip: string;
    netWeight: number;
    regime: string;
    fullMeasurement: number; // or string if unit included
    euroAmount: number;
}

export interface MasterInfo {
    etgbDate: string;
    etgbNo: string;
    flightNo: string;
    mawB: string;
    destination: string;
    warehouse: string;
    totalPieces: number;
    totalWeight: number;

    // New Fields for Header
    fileNo: string;
    declarant: string;
    location: string;
    customs: 'İSTANBUL GÜMRÜK MÜDÜRLÜĞÜ',
    inspectionOfficer: 'AHMET YILMAZ',

    // Moved from Stats
    totalValue: number;
}

export interface ETGBData {
    id: string;
    masterInfo: MasterInfo;
    hawbs: HAWBItem[];
    riskFindings: RiskFinding[];
    totalShipments: number;
    totalValue: number;
}
