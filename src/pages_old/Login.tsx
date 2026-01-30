import React, { useState } from 'react'
import { Button, Form, Input, Typography, message } from 'antd'
import { LockOutlined, LoginOutlined, UserOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onFinish = (values: any) => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      if (
        values.email === 'alican@tradevision.com' &&
        values.password === 'trade123'
      ) {
        login('Admin')
        message.success('Giriş başarılı! Yönetici olarak yönlendiriliyorsunuz.')
        navigate('/dashboard')
      } else if (
        values.email === 'user@tradevision.com' &&
        values.password === 'user123'
      ) {
        login('User')
        message.success(
          'Giriş başarılı! Kullanıcı olarak yönlendiriliyorsunuz.',
        )
        navigate('/dashboard')
      } else {
        message.error('Hatalı e-posta veya şifre.')
      }
    }, 1500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* Split Layout Container */}
      <div className="flex w-full max-w-5xl h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side: Brand & Visual */}
        <div className="w-1/2 bg-black text-white flex flex-col justify-between p-12 relative overflow-hidden">
          <div className="z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="px-3 py-1 bg-white text-black text-xl font-bold rounded">
                TV
              </div>
              <span className="text-2xl tracking-wide font-light">
                Trade<span className="font-bold">Vision</span>
              </span>
            </div>
            <Title
              level={1}
              style={{ color: 'white', fontWeight: 700, margin: 0 }}
            >
              Geleceğin Ticaret <br /> Vizyonu
            </Title>
            <Text className="text-gray-400 mt-4 block text-lg">
              Yapay zeka destekli beyanname analizi ve risk yönetimi platformu.
            </Text>
          </div>

          <div className="z-10 text-xs text-gray-500">
            &copy; 2024 TradeVision Inc. All rights reserved.
          </div>

          {/* Abstract Pattern Overlay */}
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-1/2 flex items-center justify-center p-12">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <Title level={2}>Tekrar Hoşgeldiniz</Title>
              <Text type="secondary">
                Devam etmek için hesabınıza giriş yapın.
              </Text>
            </div>

            <Form
              name="login_form"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: 'Lütfen e-posta adresinizi girin!',
                  },
                  { type: 'email', message: 'Geçerli bir e-posta giriniz!' },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="alican@tradevision.com (Admin)"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="trade123"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full bg-black hover:bg-gray-800! h-12 text-lg font-medium"
                  loading={loading}
                  icon={!loading && <LoginOutlined />}
                >
                  Giriş Yap
                </Button>
              </Form.Item>

              <div className="text-center">
                <Text type="secondary" className="text-xs">
                  Demo Hesaplar: <br />
                  Admin: alican@tradevision.com / trade123 <br />
                  User: user@tradevision.com / user123
                </Text>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
