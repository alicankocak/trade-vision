import React from 'react';
import { Card, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { HAWBItem } from './types';

interface GroupedViewProps {
    hawbs: HAWBItem[];
    selectedHawb: HAWBItem | null;
    onSelectHawb: (hawb: HAWBItem) => void;
}

export const GroupedView: React.FC<GroupedViewProps> = ({
    hawbs,
    selectedHawb,
    onSelectHawb
}) => {
    // Define columns for the line items table
    const columns: ColumnsType<HAWBItem> = [
        {
            title: 'S.No',
            dataIndex: 'sequenceNo',
            key: 'sequenceNo',
            width: 70,
            align: 'center'
        },
        {
            title: 'Ticari Tanım (Commercial Description)',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true
        },
        {
            title: 'GTİP (HS Code)',
            dataIndex: 'gtip',
            key: 'gtip',
            width: 160
        },
        {
            title: 'Brüt Ağırlık (kg)',
            dataIndex: 'weight',
            key: 'weight',
            width: 130,
            align: 'right',
            render: (value: number) => value ? value.toFixed(3) : '-'
        },
        {
            title: 'Fatura Değeri',
            dataIndex: 'value',
            key: 'value',
            width: 130,
            align: 'right',
            render: (value: number) => `€${value.toFixed(2)}` // Using existing currency or prompt suggested '$'
        },
        {
            title: 'Para Birimi',
            dataIndex: 'currency',
            key: 'currency',
            width: 100,
            align: 'center'
        }
    ];

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 480px)', gap: 16 }}>
            {/* Left Sidebar - HAWB List */}
            <div style={{
                width: 340,
                borderRight: '1px solid #f0f0f0',
                paddingRight: 16,
                overflowY: 'auto'
            }}>
                <h3 style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 16,
                    color: '#262626'
                }}>
                    📦 Taşıma Senetleri ({hawbs.length})
                </h3>
                {hawbs.map(hawb => (
                    <Card
                        key={hawb.id}
                        hoverable
                        size="small"
                        style={{
                            marginBottom: 12,
                            cursor: 'pointer',
                            borderColor: selectedHawb?.id === hawb.id ? '#1677ff' : '#d9d9d9',
                            backgroundColor: selectedHawb?.id === hawb.id ? '#e6f4ff' : '#fff'
                        }}
                        onClick={() => onSelectHawb(hawb)}
                    >
                        <div style={{ marginBottom: 8 }}>
                            <Tag color="blue" style={{ fontSize: 12 }}>{hawb.hawbNo}</Tag>
                        </div>
                        <div style={{ fontSize: 12, marginBottom: 6 }}>
                            <div style={{ color: '#8c8c8c', marginBottom: 2 }}>Gönderici:</div>
                            <div style={{ fontWeight: 600, color: '#262626' }}>{hawb.senderCompany}</div>
                        </div>
                        <div style={{ fontSize: 12, marginBottom: 6 }}>
                            <div style={{ color: '#8c8c8c', marginBottom: 2 }}>Alıcı:</div>
                            <div style={{ fontWeight: 500, color: '#262626' }}>{hawb.receiverCompany}</div>
                        </div>
                        <div style={{ fontSize: 11, color: '#8c8c8c', marginTop: 8 }}>
                            {hawb.pieces} Kalem • €{hawb.value.toFixed(2)}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Right Content Area */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
                {selectedHawb ? (
                    <>
                        {/* Selected HAWB Info */}
                        <Card
                            title={
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontSize: 16, fontWeight: 600 }}>Taşıma Senedi Detayı</span>
                                    <Tag color="blue" style={{ fontSize: 13 }}>{selectedHawb.hawbNo}</Tag>
                                </div>
                            }
                            style={{ marginBottom: 16 }}
                            size="small"
                        >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                                <div>
                                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4, fontWeight: 500 }}>
                                        Gönderici (Shipper)
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                                        {selectedHawb.senderCompany}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#595959' }}>
                                        {/* Address placeholder or add field if available. Using Trading Country as filler */}
                                        {selectedHawb.tradingCountry}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4, fontWeight: 500 }}>
                                        Alıcı (Receiver)
                                    </div>
                                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>
                                        {selectedHawb.receiverCompany}
                                    </div>
                                    <div style={{ fontSize: 12, color: '#595959' }}>
                                        {selectedHawb.destinationCountry}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>Toplam Kalem</div>
                                    <div style={{ fontSize: 16, fontWeight: 600, color: '#1677ff' }}>
                                        {selectedHawb.pieces}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>Toplam Değer</div>
                                    <div style={{ fontSize: 16, fontWeight: 600, color: '#52c41a' }}>
                                        €{selectedHawb.value.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Line Items Table */}
                        <Card
                            title={
                                <span style={{ fontSize: 16, fontWeight: 600 }}>
                                    📋 Kalemler ({selectedHawb.pieces})
                                </span>
                            }
                            size="small"
                        >
                            <Table
                                columns={columns}
                                dataSource={[selectedHawb]} // Currently mapping the HAWB itself as the single line item
                                rowKey="id"
                                pagination={false}
                                size="small"
                                bordered
                            />
                        </Card>
                    </>
                ) : (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        color: '#8c8c8c',
                        fontSize: 14
                    }}>
                        Lütfen sol taraftan bir Taşıma Senedi seçiniz
                    </div>
                )}
            </div>
        </div>
    );
};
