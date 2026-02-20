import React from 'react';
import { Table, Tag, Tooltip } from 'antd';
import { HAWBItem } from './types';
import { WarningOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface FlatViewProps {
    hawbs: HAWBItem[];
}

export const FlatView: React.FC<FlatViewProps> = ({ hawbs }) => {
    // Helper render function for text with tooltip
    const renderWithTooltip = (text: React.ReactNode) => (
        <Tooltip title={text} placement="topLeft">
            <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {text}
            </span>
        </Tooltip>
    );

    const columns: ColumnsType<HAWBItem> = [
        {
            title: 'Taşıma Senedi No',
            dataIndex: 'hawbNo',
            key: 'hawbNo',
            width: 150,
            ellipsis: { showTitle: false },
            render: (text) => (
                <Tooltip title={text} placement="topLeft">
                    <a className="text-blue-600 hover:text-blue-800" style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</a>
                </Tooltip>
            ),
        },
        {
            title: 'Sira No',
            dataIndex: 'sequenceNo',
            key: 'sequenceNo',
            width: 80,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Gönderen Firma',
            dataIndex: 'senderCompany',
            key: 'senderCompany',
            width: 150,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Alıcı Firma',
            dataIndex: 'receiverCompany',
            key: 'receiverCompany',
            width: 150,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Kap',
            dataIndex: 'pieces',
            key: 'pieces',
            width: 80,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Brüt Kg',
            dataIndex: 'weight',
            key: 'weight',
            width: 100,
            ellipsis: { showTitle: false },
            render: (val) => renderWithTooltip(val ? val.toFixed(2) : '0.00'),
        },
        {
            title: 'Kap Cinsi',
            dataIndex: 'packageType',
            key: 'packageType',
            width: 100,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Gönderen Vergi No',
            dataIndex: 'senderTaxId',
            key: 'senderTaxId',
            width: 150,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Tic. Ülke',
            dataIndex: 'tradingCountry',
            key: 'tradingCountry',
            width: 100,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Gid. Ülke',
            dataIndex: 'destinationCountry',
            key: 'destinationCountry',
            width: 100,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Çıkış Ülke',
            dataIndex: 'departureCountry',
            key: 'departureCountry',
            width: 100,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Menşei',
            dataIndex: 'origin',
            key: 'origin',
            width: 100,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Gtip',
            dataIndex: 'gtip',
            key: 'gtip',
            width: 150,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Ticari Tanım',
            dataIndex: 'description',
            key: 'description',
            width: 200,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Net Kg',
            dataIndex: 'netWeight',
            key: 'netWeight',
            width: 100,
            ellipsis: { showTitle: false },
            render: (val) => renderWithTooltip(val ? val.toFixed(2) : '0.00'),
        },
        {
            title: 'Rejim',
            dataIndex: 'regime',
            key: 'regime',
            width: 100,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Tam Ölçü Miktarı',
            dataIndex: 'fullMeasurement',
            key: 'fullMeasurement',
            width: 120,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Döviz Cinsi',
            dataIndex: 'currency',
            key: 'currency',
            width: 100,
            ellipsis: { showTitle: false },
            render: renderWithTooltip,
        },
        {
            title: 'Fatura Tutarı',
            dataIndex: 'value',
            key: 'value',
            width: 120,
            ellipsis: { showTitle: false },
            render: (val) => renderWithTooltip(val ? val.toFixed(2) : '0.00'),
        },
        {
            title: 'Euro Tutarı',
            dataIndex: 'euroAmount',
            key: 'euroAmount',
            width: 120,
            ellipsis: { showTitle: false },
            render: (val) => renderWithTooltip(val ? val.toFixed(2) : '0.00'),
        }
    ];

    return (
        <Table
            dataSource={hawbs}
            columns={columns}
            rowKey="id"
            size="small"
            pagination={{ pageSize: 15 }}
            scroll={{ x: 'max-content' }}
        />
    );
};
