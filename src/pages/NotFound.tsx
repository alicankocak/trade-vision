import React from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from '@tanstack/react-router'

const NotFound: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Result
        status="404"
        title="404"
        subTitle="Üzgünüz, aradığınız sayfa mevcut değil."
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
    </div>
  )
}

export default NotFound
