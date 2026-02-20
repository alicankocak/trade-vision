import React from 'react';
import { Card, Row, Col, Button } from 'antd';
import { FileTextOutlined, EyeOutlined } from '@ant-design/icons';
import { MasterInfo } from './types';

interface MasterHeaderProps {
    masterInfo: MasterInfo;
}

export const MasterHeader: React.FC<MasterHeaderProps> = ({ masterInfo }) => {
    return (
        <Card
            style={{
                marginBottom: 16,
                background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)',
                border: 'none',
                borderRadius: 12,
                boxShadow: '0 4px 20px rgba(22, 119, 255, 0.25)'
            }}
            bodyStyle={{ padding: 24 }}
        >
            {/* Header Title Section */}
            <div style={{
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: '1px solid rgba(255, 255, 255, 0.15)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FileTextOutlined style={{ fontSize: 18, color: '#fff' }} />
                    <h2 style={{
                        margin: 0,
                        fontSize: 16,
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '-0.2px'
                    }}>
                        ETGB Bilgileri
                    </h2>
                </div>
            </div>

            {/* Top Section - ETGB No and View Button */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 18
            }}>
                <div>
                    <div style={{
                        fontSize: 11,
                        color: 'rgba(255, 255, 255, 0.75)',
                        fontWeight: 500,
                        marginBottom: 5,
                        textTransform: 'uppercase',
                        letterSpacing: '0.8px'
                    }}>
                        ETGB Numarası
                    </div>
                    <div style={{
                        fontSize: 24,
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '1px',
                        lineHeight: 1
                    }}>
                        {masterInfo.etgbNo}
                    </div>
                </div>

                {/* Button Removed per user request */}
            </div>

            {/* Info Cards Row */}
            <Row gutter={16}>
                {/* ETGB Tarih */}
                <Col xs={24} sm={12} md={6}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 10,
                        padding: '12px 14px',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            fontSize: 10,
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: 5,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.7px'
                        }}>
                            Tarih
                        </div>
                        <div style={{
                            fontSize: 14,
                            color: '#fff',
                            fontWeight: 700,
                            letterSpacing: '-0.2px'
                        }}>
                            {masterInfo.etgbDate}
                        </div>
                    </div>
                </Col>

                {/* Dosya No */}
                <Col xs={24} sm={12} md={6}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 10,
                        padding: '12px 14px',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            fontSize: 10,
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: 5,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.7px'
                        }}>
                            Dosya No
                        </div>
                        <div style={{
                            fontSize: 14,
                            color: '#fff',
                            fontWeight: 700,
                            letterSpacing: '-0.2px'
                        }}>
                            {masterInfo.fileNo}
                        </div>
                    </div>
                </Col>

                {/* Beyan Sahibi */}
                <Col xs={24} sm={12} md={6}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 10,
                        padding: '12px 14px',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            fontSize: 10,
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: 5,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.7px'
                        }}>
                            Beyan Sahibi
                        </div>
                        <div style={{
                            fontSize: 14,
                            color: '#fff',
                            fontWeight: 700,
                            letterSpacing: '-0.2px'
                        }}>
                            {masterInfo.declarant}
                        </div>
                    </div>
                </Col>

                {/* Gümrük */}
                <Col xs={24} sm={12} md={6}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.12)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: 10,
                        padding: '12px 14px',
                        transition: 'all 0.3s ease'
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.18)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            fontSize: 10,
                            color: 'rgba(255, 255, 255, 0.7)',
                            marginBottom: 5,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.7px'
                        }}>
                            Gümrük
                        </div>
                        <div style={{
                            fontSize: 14,
                            color: '#fff',
                            fontWeight: 700,
                            letterSpacing: '-0.2px'
                        }}>
                            {masterInfo.customs}
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Secondary Info Row */}
            <Row gutter={16} style={{ marginTop: 14 }}>
                {/* Bulunduğu Yer */}
                <Col xs={24} sm={12} md={8}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        padding: '10px 12px'
                    }}>
                        <div style={{
                            fontSize: 10,
                            color: 'rgba(255, 255, 255, 0.65)',
                            marginBottom: 4,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px'
                        }}>
                            Bulunduğu Yer
                        </div>
                        <div style={{
                            fontSize: 13,
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontWeight: 600,
                            letterSpacing: '-0.2px'
                        }}>
                            {masterInfo.location}
                        </div>
                    </div>
                </Col>

                {/* Ambar */}
                <Col xs={24} sm={12} md={8}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        padding: '10px 12px'
                    }}>
                        <div style={{
                            fontSize: 10,
                            color: 'rgba(255, 255, 255, 0.65)',
                            marginBottom: 4,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px'
                        }}>
                            Ambar
                        </div>
                        <div style={{
                            fontSize: 13,
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontWeight: 600,
                            letterSpacing: '-0.2px'
                        }}>
                            {masterInfo.warehouse}
                        </div>
                    </div>
                </Col>

                {/* Muayene Memuru */}
                <Col xs={24} sm={24} md={8}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: 8,
                        padding: '10px 12px'
                    }}>
                        <div style={{
                            fontSize: 10,
                            color: 'rgba(255, 255, 255, 0.65)',
                            marginBottom: 4,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.6px'
                        }}>
                            Muayene Memuru
                        </div>
                        <div style={{
                            fontSize: 13,
                            color: 'rgba(255, 255, 255, 0.95)',
                            fontWeight: 600,
                            letterSpacing: '-0.2px'
                        }}>
                            {masterInfo.inspectionOfficer}
                        </div>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};
