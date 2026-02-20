import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, ConfigProvider, theme } from 'antd';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export interface UserFormData {
    id?: string;
    name: string;
    email: string;
    role: 'Admin' | 'Manager' | 'Viewer';
    status: 'Aktif' | 'Pasif';
}

interface UserModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (values: UserFormData) => void;
    initialValues?: UserFormData | null;
    loading?: boolean;
}

export const UserModal: React.FC<UserModalProps> = ({
    open,
    onClose,
    onSubmit,
    initialValues,
    loading = false
}) => {
    const { isDarkMode } = useTheme();
    const { isAdmin } = useAuth();
    const [form] = Form.useForm();

    const isEditing = !!initialValues;

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [open, initialValues, form]);

    const handleFinish = (values: any) => {
        onSubmit({
            id: initialValues?.id,
            ...values
        });
    };

    const modalBg = isDarkMode ? '#1f1f1f' : '#ffffff';
    const borderCol = isDarkMode ? '#303030' : '#d9d9d9';

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorBgContainer: modalBg,
                    colorBorder: borderCol,
                    borderRadius: 8,
                },
                components: {
                    Modal: {
                        contentBg: modalBg,
                        headerBg: modalBg,
                    },
                    Input: {
                        borderRadius: 8,
                        colorBgContainer: isDarkMode ? '#141414' : '#ffffff',
                    },
                    Select: {
                        borderRadius: 8,
                        colorBgContainer: isDarkMode ? '#141414' : '#ffffff',
                    },
                    Button: {
                        borderRadius: 8,
                    }
                }
            }}
        >
            <Modal
                title={
                    <span style={{ color: isDarkMode ? 'white' : '#262626' }}>
                        {isEditing ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle'}
                    </span>
                }
                open={open}
                onCancel={onClose}
                footer={null}
                style={{ borderRadius: 8, overflow: 'hidden' }}
                destroyOnClose
            >
                <div className="pt-4">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFinish}
                    >
                        <Form.Item
                            name="name"
                            label="Ad Soyad"
                            rules={[{ required: true, message: 'Lütfen ad soyad girin' }]}
                        >
                            <Input size="large" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="E-posta"
                            rules={[
                                { required: true, message: 'Lütfen e-posta adresi girin' },
                                { type: 'email', message: 'Geçerli bir e-posta adresi girin' }
                            ]}
                        >
                            <Input
                                size="large"
                                disabled={isEditing}
                                title={isEditing ? 'E-posta adresi sonradan değiştirilemez' : ''}
                            />
                        </Form.Item>

                        <Form.Item
                            name="role"
                            label="Rol"
                            rules={[{ required: true, message: 'Lütfen rol seçin' }]}
                        >
                            <Select size="large">
                                <Select.Option value="Admin">Admin</Select.Option>
                                <Select.Option value="Manager">Manager</Select.Option>
                                <Select.Option value="Viewer">Viewer</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Statü"
                            rules={[{ required: true, message: 'Lütfen statü seçin' }]}
                        >
                            <Select size="large">
                                <Select.Option value="Aktif">Aktif</Select.Option>
                                <Select.Option value="Pasif">Pasif</Select.Option>
                            </Select>
                        </Form.Item>

                        {!isEditing && (
                            <Form.Item
                                name="password"
                                label="Geçici Şifre"
                                rules={[{ required: true, message: 'Lütfen geçici bir şifre belirleyin' }]}
                            >
                                <Input.Password size="large" />
                            </Form.Item>
                        )}

                        <div className="flex justify-end gap-2 mt-6">
                            <Button
                                onClick={onClose}
                                size="large"
                                style={{ borderRadius: 8 }}
                            >
                                İptal
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                style={{
                                    backgroundColor: isDarkMode ? '#ffffff' : '#262626',
                                    color: isDarkMode ? '#000000' : '#ffffff',
                                    borderRadius: 8
                                }}
                            >
                                Kaydet
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </ConfigProvider>
    );
};
