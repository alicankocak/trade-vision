import React, { useState } from 'react';
import { Card, Form, Input, Button, Tabs, message, Row, Col, Typography, Avatar } from 'antd';
import { UserOutlined, MailOutlined, BankOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';

const { Title, Text } = Typography;

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const onUpdateProfile = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            message.success('Profil bilgileri güncellendi.');
            console.log('Updated Profile:', values);
        }, 1500);
    };

    const onChangePassword = (values: any) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (values.newPassword !== values.confirmPassword) {
                message.error('Şifreler uyuşmuyor!');
                return;
            }
            message.success('Şifre başarıyla değiştirildi.');
        }, 1500);
    };

    const items = [
        {
            key: '1',
            label: 'Profil Bilgileri',
            children: (
                <Form
                    layout="vertical"
                    initialValues={{
                        name: user?.name,
                        email: user?.email,
                        company: user?.company,
                    }}
                    onFinish={onUpdateProfile}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item label="Ad Soyad" name="name" rules={[{ required: true, message: 'Ad Soyad zorunludur' }]}>
                                <Input prefix={<UserOutlined className="text-gray-400" />} placeholder="Ad Soyad" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="E-posta" name="email" rules={[{ required: true, type: 'email', message: 'Geçerli bir e-posta giriniz' }]}>
                                <Input prefix={<MailOutlined className="text-gray-400" />} placeholder="E-posta" />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item label="Firma" name="company">
                                <Input prefix={<BankOutlined className="text-gray-400" />} placeholder="Firma Adı" />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} className="bg-black hover:bg-gray-800">
                            Değişiklikleri Kaydet
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
        {
            key: '2',
            label: 'Şifre Değiştir',
            children: (
                <Form layout="vertical" onFinish={onChangePassword}>
                    <Form.Item label="Mevcut Şifre" name="currentPassword" rules={[{ required: true, message: 'Mevcut şifre zorunludur' }]}>
                        <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Mevcut Şifre" />
                    </Form.Item>
                    <Form.Item label="Yeni Şifre" name="newPassword" rules={[{ required: true, message: 'Yeni şifre zorunludur' }]}>
                        <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Yeni Şifre" />
                    </Form.Item>
                    <Form.Item
                        label="Yeni Şifre Tekrar"
                        name="confirmPassword"
                        rules={[
                            { required: true, message: 'Şifre tekrarı zorunludur' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Şifreler eşleşmiyor!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password prefix={<LockOutlined className="text-gray-400" />} placeholder="Yeni Şifre Tekrar" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} className="bg-black hover:bg-gray-800">
                            Şifreyi Güncelle
                        </Button>
                    </Form.Item>
                </Form>
            ),
        },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto py-8">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Card className="text-center shadow-sm">
                        <div className="flex flex-col items-center gap-4 py-4">
                            <Avatar size={100} icon={<UserOutlined />} className="bg-gray-200 text-gray-600" />
                            <div>
                                <Title level={4} style={{ margin: 0 }}>{user?.name}</Title>
                                <Text type="secondary">{user?.role} - {user?.company}</Text>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col xs={24} md={16}>
                    <Card className="shadow-sm">
                        <Tabs defaultActiveKey="1" items={items} />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Profile;
