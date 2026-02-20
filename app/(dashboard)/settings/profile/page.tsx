'use client';

import React, { useState } from 'react';
import { Typography, Form, Input, Button, Card, ConfigProvider, theme, message } from 'antd';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { hashPassword } from '@/utils/crypto';

const { Title } = Typography;

export default function ProfilePage() {
    const { user } = useAuth();
    const { isDarkMode } = useTheme();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: any) => {
        setLoading(true);
        // Simulate API call
        try {
            if (values.password) {
                const hashedPassword = await hashPassword(values.password);
                console.log('Hashed Password:', hashedPassword);
                // Normally you would send this to the server
            }

            await new Promise((resolve) => setTimeout(resolve, 1500));
            message.success('Profil bilgileriniz başarıyla güncellendi.');
        } catch (error) {
            message.error('Güncelleme sırasında bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const searchBg = isDarkMode ? '#141414' : '#ffffff';
    const borderCol = isDarkMode ? '#303030' : '#d9d9d9';

    if (!user) {
        return <div className="p-6">Yükleniyor...</div>;
    }

    // Default values for the form
    const [firstName, lastName] = user.name.split(' ');

    return (
        <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-black' : 'bg-[#fafafa]'}`}>
            <div className="max-w-2xl mx-auto">
                <Title level={4} style={{ color: isDarkMode ? 'white' : '#262626', marginBottom: 24 }}>
                    Profilim
                </Title>

                <ConfigProvider
                    theme={{
                        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                        token: {
                            colorPrimary: isDarkMode ? '#ffffff' : '#262626',
                            colorBgContainer: searchBg,
                            colorBorder: borderCol,
                            borderRadius: 8,
                        },
                        components: {
                            Input: {
                                borderRadius: 8,
                            },
                            Button: {
                                borderRadius: 8,
                            },
                            Card: {
                                borderRadius: 8,
                            }
                        }
                    }}
                >
                    <Card
                        bordered={true}
                        style={{ backgroundColor: searchBg, borderColor: borderCol, borderRadius: 8 }}
                    >
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            initialValues={{
                                firstName: firstName || '',
                                lastName: lastName || '',
                                email: user.email,
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Form.Item
                                    name="firstName"
                                    label="Ad"
                                    rules={[{ required: true, message: 'Lütfen adınızı girin' }]}
                                >
                                    <Input size="large" />
                                </Form.Item>

                                <Form.Item
                                    name="lastName"
                                    label="Soyad"
                                    rules={[{ required: true, message: 'Lütfen soyadınızı girin' }]}
                                >
                                    <Input size="large" />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="email"
                                label="E-posta"
                                rules={[
                                    { required: true, message: 'Lütfen e-posta adresinizi girin' },
                                    { type: 'email', message: 'Geçerli bir e-posta adresi girin' }
                                ]}
                            >
                                <Input size="large" />
                            </Form.Item>

                            <div className="my-6 border-t border-dashed" style={{ borderColor: borderCol }}></div>

                            <Title level={5} style={{ color: isDarkMode ? 'white' : '#262626', marginBottom: 16 }}>
                                Şifre Değişikliği
                            </Title>

                            <Form.Item
                                name="password"
                                label="Yeni Şifre"
                                rules={[{ min: 6, message: 'Şifreniz en az 6 karakter olmalıdır' }]}
                                extra="Şifrenizi değiştirmek istemiyorsanız bu alanı boş bırakabilirsiniz."
                            >
                                <Input.Password size="large" />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label="Yeni Şifre (Tekrar)"
                                dependencies={['password']}
                                rules={[
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Şifreler eşleşmiyor!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password size="large" />
                            </Form.Item>

                            <Form.Item className="mb-0 mt-8 text-right">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    size="large"
                                    loading={loading}
                                    style={{
                                        backgroundColor: isDarkMode ? '#ffffff' : '#262626',
                                        color: isDarkMode ? '#000000' : '#ffffff',
                                        borderRadius: '8px'
                                    }}
                                >
                                    Kaydet
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </ConfigProvider>
            </div>
        </div>
    );
}
