import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from '@tanstack/react-router'

const Unauthorized: React.FC = () => {
  const navigate = useNavigate()

  return (
    <Result
      status="403"
      title="403"
      subTitle="Üzgünüz, bu sayfaya erişim yetkiniz yok."
      extra={
        <Button
          type="primary"
          onClick={() => navigate({ to: '/' })}
          className="bg-black hover:bg-gray-800"
        >
          Anasayfaya Dön
        </Button>
      }
    />
  )
}

export default Unauthorized
