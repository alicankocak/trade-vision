import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { WarningOutlined, InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { RiskFinding } from './types';

const { Text, Paragraph } = Typography;

interface RiskCardProps {
    risk: RiskFinding;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk }) => {
    const getIcon = () => {
        switch (risk.severity) {
            case 'critical': return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
            case 'warning': return <WarningOutlined style={{ color: '#faad14' }} />;
            case 'info': return <InfoCircleOutlined style={{ color: '#722ed1' }} />; // Purple for AI/ML
        }
    };

    const getColor = () => {
        switch (risk.severity) {
            case 'critical': return '#fff1f0';
            case 'warning': return '#fffbe6';
            case 'info': return '#f9f0ff'; // Purple background
        }
    };

    const getBorderColor = () => {
        switch (risk.severity) {
            case 'critical': return '#ffccc7';
            case 'warning': return '#ffe58f';
            case 'info': return '#d3adf7'; // Purple border
        }
    };

    const getCategoryColor = () => {
        switch (risk.severity) {
            case 'critical': return '#ff4d4f';
            case 'warning': return '#d48806'; // Darker yellow for text
            case 'info': return '#722ed1';
        }
    };

    return (
        <Card
            size="small"
            style={{
                width: 320, // Slightly wider to accommodate content
                minWidth: 320,
                backgroundColor: getColor(),
                borderColor: getBorderColor(),
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
            bodyStyle={{ padding: 16 }}
        >
            {/* Header: Icon + Category (Colored) */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {getIcon()}
                <span style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: getCategoryColor()
                }}>
                    {risk.category}
                </span>
            </div>

            {/* Title: Message (Bold Black) */}
            <div style={{
                fontSize: 14,
                fontWeight: 600,
                color: '#262626',
                marginBottom: 8
            }}>
                {risk.message}
            </div>

            {/* Description (Grey) */}
            <Paragraph
                ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}
                style={{ marginBottom: 12, fontSize: 13, color: '#595959', lineHeight: '20px' }}
            >
                {risk.description || risk.message}
            </Paragraph>

            {/* Related Item Section */}
            {risk.relatedItem && (
                <>
                    <div style={{ width: '100%', height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginBottom: 8 }} />
                    <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>
                        Riski İçeren Kalem:
                    </div>
                    <div style={{
                        display: 'inline-block',
                        border: `1px solid ${getCategoryColor()}`,
                        borderRadius: 4,
                        padding: '2px 8px',
                        fontSize: 13,
                        fontWeight: 600,
                        color: getCategoryColor(),
                        backgroundColor: 'rgba(255,255,255,0.6)'
                    }}>
                        {risk.relatedItem}
                    </div>
                </>
            )}
        </Card>
    );
};
