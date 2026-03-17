'use client';

import React, { useEffect } from 'react';
import { Table, Tag, Button, Input } from 'antd';
import { PlusOutlined, BankOutlined, SearchOutlined } from '@ant-design/icons';
import { PermissionGuard } from '@/components/common/PermissionGuard';
import { mockCompanies } from '@/data/mockAuthData';
import { useTheme } from '@/context/ThemeContext';
import { auditLogger } from '@/utils/auditLogger';

export default function CompaniesSettingsPage() {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Audit log that the page was viewed
    auditLogger.log('VIEW_DASHBOARD', 'settings-companies-page', 'User accessed the Company settings list');
  }, []);

  const columns = [
    {
      title: 'Firma Adı',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <span className="font-semibold text-slate-800 dark:text-slate-200">{text}</span>
      ),
    },
    {
      title: 'Tip',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'GUMRUK' ? 'blue' : 'orange'} className="rounded-md font-medium">
          {type === 'GUMRUK' ? 'Gümrük Müşavirliği' : 'Ticaret Firması'}
        </Tag>
      ),
    },
    {
      title: 'Vergi No',
      dataIndex: 'taxNumber',
      key: 'taxNumber',
    },
    {
      title: 'Durum',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'error'} className="rounded-md px-2 py-0.5">
          {status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
        </Tag>
      ),
    },
    {
      title: 'İşlemler',
      key: 'actions',
      render: () => (
        <Button size="small" type="link" className="text-blue-500 font-medium">Düzenle</Button>
      ),
    },
  ];

  return (
    <PermissionGuard allowedRoles={['ADMIN']} requireSuperAdmin>
      <div className={`p-6 md:p-8 min-h-screen ${isDarkMode ? 'bg-[#000]' : 'bg-[#fcfcfc]'}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <BankOutlined />
                </div>
                Firma Yönetimi
              </h1>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                Sistemdeki Gümrük ve Ticaret firmalarını listeleyip yeni kayıtlar açabilirsiniz.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Input 
                placeholder="Firma veya Vergi No Ara..." 
                prefix={<SearchOutlined className="text-slate-400" />} 
                className="w-full md:w-64 rounded-lg"
              />
              <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 rounded-lg">
                Yeni Firma
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className={`rounded-xl border ${isDarkMode ? 'bg-[#141414] border-gray-800' : 'bg-white border-gray-100'} shadow-sm overflow-hidden`}>
            <Table 
              columns={columns} 
              dataSource={mockCompanies.map(c => ({ ...c, key: c.id }))} 
              pagination={{ pageSize: 10 }}
              className={`custom-table ${isDarkMode ? 'ant-table-dark' : ''}`}
            />
          </div>

        </div>
      </div>
    </PermissionGuard>
  );
}
