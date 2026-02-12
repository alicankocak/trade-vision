export interface ShippingInsurance {
    totalInvoiceTRY: number;
    pbc: number;
    shipping: number;
    shippingPercent: number;
    insurance: number;
    insurancePercent: number;
}

export interface Tax {
    taxType: string;
    rate: number;
    base: number;
    calculatedTax: number;
}

export interface DeclarationItem {
    id: string;
    gtip: string;
    origin: string;
    quantity: number;
    unit: string;
    invoiceAmount: number;
    currency: string;
    tradeName: string;
    agreement?: string;
}

export interface Sender {
    name: string;
    country: string;
}

export interface ExtendedDeclaration {
    id: string;
    declarationNumber: string;
    date: string;
    deliveryType: string; // e.g., CIF, FOB
    paymentType: string; // e.g., Peşin, Mal Mukabili
    sender: Sender;
    exitCountry: string;
    regimeCode: string;
    shippingInsurance: ShippingInsurance[];
    paidTaxes: Tax[];
    items: DeclarationItem[];
}

export const mockDeclarations: ExtendedDeclaration[] = [
    {
        id: '1',
        declarationNumber: 'TR-34-2024-001',
        date: '2024-01-26',
        deliveryType: 'CIF',
        paymentType: 'Peşin',
        sender: {
            name: 'Global Tech GmbH',
            country: 'Almanya',
        },
        exitCountry: 'Almanya',
        regimeCode: '4000',
        shippingInsurance: [
            {
                totalInvoiceTRY: 950000.0,
                pbc: 1.0,
                shipping: 15400.0,
                shippingPercent: 1.62,
                insurance: 3200.0,
                insurancePercent: 0.34,
            },
        ],
        paidTaxes: [
            {
                taxType: 'Gümrük Vergisi',
                rate: 0,
                base: 968600.0,
                calculatedTax: 0.0,
            },
            {
                taxType: 'İlave Gümrük Vergisi',
                rate: 20,
                base: 968600.0,
                calculatedTax: 193720.0,
            },
            {
                taxType: 'KDV',
                rate: 20,
                base: 1162320.0,
                calculatedTax: 232464.0,
            },
            {
                taxType: 'Damga Vergisi',
                rate: 0,
                base: 0,
                calculatedTax: 3450.0,
            },
        ],
        items: [
            {
                id: '1',
                gtip: '8542.31.00.00.00',
                origin: 'Almanya',
                quantity: 150,
                unit: 'KGM',
                invoiceAmount: 25000.0,
                currency: 'EUR',
                tradeName: 'Entegre Devre Kartı',
                agreement: 'ATR',
            },
            {
                id: '2',
                gtip: '8534.00.11.00.00',
                origin: 'Almanya',
                quantity: 50,
                unit: 'KGM',
                invoiceAmount: 5000.0,
                currency: 'EUR',
                tradeName: 'Baskılı Devre',
                agreement: 'ATR',
            },
        ],
    },
];
