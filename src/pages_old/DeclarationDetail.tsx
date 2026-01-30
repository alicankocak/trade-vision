import React, { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Col,
  List,
  Modal,
  Row,
  Skeleton,
  Space,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd'
import {
  CloudDownloadOutlined,
  EyeOutlined,
  FilePdfOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { useTheme } from '../context/ThemeContext'
import {
  declarationFiles,
  declarationRisks,
  mockXmlData,
} from '../utils/mockData'

const { Title: _Title } = Typography

const DeclarationDetail: React.FC = () => {
  const { isDarkMode } = useTheme()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleUpdateStatus = () => {
    setUpdating(true)
    setTimeout(() => {
      setUpdating(false)
      message.success('Statü başarıyla güncellendi')
    }, 1500)
  }

  const handlePreview = (url: string) => {
    setPreviewUrl(url)
    setPreviewVisible(true)
  }

  // Card Styles
  const cardStyle = {
    background: isDarkMode ? '#141414' : '#ffffff',
    borderColor: isDarkMode ? '#303030' : '#e2e2e4',
  }

  const items = [
    {
      key: '1',
      label: 'Beyanname ve Riskler',
      children: (
        <Row gutter={[16, 16]} className="h-full">
          {/* Left Panel: XML Viewer */}
          <Col xs={24} md={12} className="h-full flex flex-col">
            <Card
              title={
                <span style={{ color: isDarkMode ? 'white' : 'black' }}>
                  Beyanname XML Önizleme
                </span>
              }
              className={`h-full shadow-sm flex flex-col ${isDarkMode ? 'border-[#303030]' : 'border-gray-100'}`}
              style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}
              bodyStyle={{
                flex: 1,
                overflow: 'auto',
                padding: 0,
                backgroundColor: isDarkMode ? '#000000' : '#f9f9f9',
              }}
            >
              {loading ? (
                <div className="p-4">
                  <Skeleton active paragraph={{ rows: 15 }} />
                </div>
              ) : (
                <pre
                  style={{
                    margin: 0,
                    height: '100%',
                    fontSize: '13px',
                    padding: '16px',
                    color: isDarkMode ? '#a5b3ce' : '#333',
                    fontFamily:
                      'Menlo, Monaco, Consolas, "Courier New", monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                  }}
                >
                  {mockXmlData}
                </pre>
              )}
            </Card>
          </Col>

          {/* Right Panel: Risk Details */}
          <Col
            xs={24}
            md={12}
            className="h-full flex flex-col gap-4 overflow-auto"
          >
            <Card
              title={
                <Space>
                  <WarningOutlined className="text-orange-500" />{' '}
                  <span style={{ color: isDarkMode ? 'white' : 'black' }}>
                    riskMAN Ön Analiz
                  </span>
                </Space>
              }
              className={`shadow-sm ${isDarkMode ? 'border-[#303030]' : 'border-gray-100'}`}
              style={cardStyle}
            >
              {loading ? (
                <Skeleton active paragraph={{ rows: 3 }} />
              ) : (
                <div className="flex flex-col gap-4">
                  {declarationRisks.map((risk) => (
                    <Alert
                      key={risk.id}
                      message={
                        <div className="flex flex-col gap-2">
                          <div
                            className={`flex justify-between items-center p-1 rounded ${isDarkMode ? 'bg-[#1f1f1f]' : 'bg-white/50'}`}
                          >
                            <Space>
                              <Tag
                                color={
                                  risk.severity === 'high'
                                    ? '#7f1d1d'
                                    : '#78350f'
                                }
                                className={`m-0 font-bold ${isDarkMode ? 'text-red-300 border-red-900' : ''}`}
                              >
                                {risk.code}
                              </Tag>
                              <span
                                className={`font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
                              >
                                {risk.ruleName}
                              </span>
                            </Space>
                            {risk.itemNo !== '-' && (
                              <span
                                className={`text-xs font-mono px-2 py-0.5 rounded ${isDarkMode ? 'text-gray-400 bg-[#303030]' : 'text-gray-500 bg-gray-100'}`}
                              >
                                Kalem: {risk.itemNo}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col gap-1 text-sm">
                            <div className="flex gap-2">
                              <span
                                className={`font-medium min-w-[60px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
                              >
                                Konu:
                              </span>
                              <span
                                className={
                                  isDarkMode ? 'text-gray-300' : 'text-gray-800'
                                }
                              >
                                {risk.subject}
                              </span>
                            </div>
                            <div className="flex gap-2">
                              <span
                                className={`font-medium min-w-[60px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}
                              >
                                Detay:
                              </span>
                              <span
                                className={
                                  isDarkMode ? 'text-gray-400' : 'text-gray-700'
                                }
                              >
                                {risk.details}
                              </span>
                            </div>
                          </div>
                        </div>
                      }
                      type={risk.severity === 'high' ? 'error' : 'warning'}
                      showIcon={false}
                      className={`border-l-4 p-4 ${isDarkMode ? 'bg-[#141414] border-[#303030]' : ''}`}
                      style={{
                        borderLeftColor:
                          risk.severity === 'high' ? '#ef4444' : '#f59e0b',
                        background: isDarkMode ? '#1f1f1f' : undefined,
                        border: isDarkMode ? '1px solid #303030' : undefined,
                        borderLeftWidth: '4px',
                      }}
                    />
                  ))}
                </div>
              )}
            </Card>
          </Col>
        </Row>
      ),
    },
    {
      key: '2',
      label: 'Arşiv Dokümanları',
      children: (
        <Card className="shadow-sm border border-gray-100" style={cardStyle}>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4, xl: 4, xxl: 4 }}
            dataSource={declarationFiles}
            renderItem={(item) => (
              <List.Item>
                <Card
                  hoverable
                  className="border-gray-200"
                  style={{
                    ...cardStyle,
                    borderColor: isDarkMode ? '#303030' : '#e2e2e4',
                  }}
                >
                  <div className="flex flex-col items-center gap-4 py-4">
                    <FilePdfOutlined className="text-4xl text-red-500" />
                    <div className="text-center">
                      <div
                        className={`font-medium truncate max-w-[150px] ${isDarkMode ? 'text-gray-200' : ''}`}
                        title={item.name}
                      >
                        {item.name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {item.type} • {item.size}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => handlePreview(item.url)}
                        className={
                          isDarkMode
                            ? 'bg-[#303030] text-white border-none'
                            : ''
                        }
                      >
                        Önizle
                      </Button>
                      <Button
                        size="small"
                        icon={<CloudDownloadOutlined />}
                        className={
                          isDarkMode
                            ? 'bg-[#303030] text-white border-none'
                            : ''
                        }
                      >
                        İndir
                      </Button>
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />
        </Card>
      ),
    },
  ]

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
      {/* Header */}
      <div
        className={`flex justify-between items-center p-4 rounded-lg border shadow-sm shrink-0 transition-colors ${isDarkMode ? 'bg-[#141414] border-[#303030]' : 'bg-white border-gray-100'}`}
      >
        <div>
          {loading ? (
            <div className="flex flex-col gap-2">
              <Skeleton.Input active size="small" style={{ width: 200 }} />
              <Skeleton.Input active size="small" style={{ width: 300 }} />
            </div>
          ) : (
            <>
              <h2
                className={`text-xl font-bold m-0 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-black'}`}
              >
                TR-34-2024-001
                <Tag
                  color={isDarkMode ? 'default' : 'blue'}
                  className={
                    isDarkMode ? 'bg-[#303030] text-white border-0' : ''
                  }
                >
                  İthalat
                </Tag>
              </h2>
              <span className="text-gray-500 text-sm">
                İstanbul Havalimanı (3400) | 26.01.2024
              </span>
            </>
          )}
        </div>
        <Space>
          <Button
            icon={<CloudDownloadOutlined />}
            disabled={loading}
            className={
              isDarkMode ? 'bg-[#1f1f1f] border-[#303030] text-white' : ''
            }
          >
            XML İndir
          </Button>
          <Button
            type="primary"
            loading={updating}
            disabled={loading}
            onClick={handleUpdateStatus}
            className={
              isDarkMode
                ? 'bg-white text-black hover:bg-gray-200'
                : 'bg-black hover:bg-gray-800'
            }
          >
            TCGB Statü Güncelle
          </Button>
        </Space>
      </div>

      {/* Tabs Content */}
      <div
        className={`flex-1 overflow-hidden rounded-lg border p-4 ${isDarkMode ? 'bg-[#141414] border-[#303030]' : 'bg-white border-gray-100'}`}
      >
        <Tabs
          defaultActiveKey="1"
          items={items}
          className="h-full [&_.ant-tabs-content]:h-full [&_.ant-tabs-tabpane]:h-full"
        />
      </div>

      {/* PDF Preview Modal */}
      <Modal
        title="Doküman Önizleme"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width={800}
        bodyStyle={{ height: '600px', padding: 0 }}
        destroyOnClose
      >
        <iframe
          src={previewUrl}
          title="PDF Preview"
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        />
      </Modal>
    </div>
  )
}

export default DeclarationDetail
