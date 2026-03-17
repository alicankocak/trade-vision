'use client';

import React, { useEffect, useMemo } from 'react';
import { Table, Tag, Button, Input, Select } from 'antd';
import { PlusOutlined, TeamOutlined, SearchOutlined } from '@ant-design/icons';
import { PermissionGuard } from '@/components/common/PermissionGuard';
import { mockUsers, mockCompanies } from '@/data/mockAuthData';
import { useTheme } from '@/context/ThemeContext';
import { useAuthStore } from '@/store/useAuthStore';
import { auditLogger } from '@/utils/auditLogger';

export default function UsersSettingsPage() {
  const { isDarkMode } = useTheme();
  const { currentUser } = useAuthStore();

  useEffect(() => {
    auditLogger.log('VIEW_DASHBOARD', 'settings-users-page', 'User accessed the Users settings list');
  }, []);

  // Filter users based on RBAC logic
  const visibleUsers = useMemo(() => {
    if (!currentUser) return [];
    
    const isSuperAdmin = currentUser.role === 'ADMIN' && currentUser.primaryCompanyId === 'comp_atez';

    // Super Admin sees everyone
    if (isSuperAdmin) {
      return mockUsers;
    }
    
    // Normal Admin or Musavir sees users inside their assigned companies OR their own firm
    if (currentUser.role === 'ADMIN' || currentUser.role === 'MUSAVIR') {
      const allowedFirmIds = [currentUser.primaryCompanyId, ...currentUser.assignedCompanyIds];
      return mockUsers.filter(u => 
        allowedFirmIds.includes(u.primaryCompanyId) && u.primaryCompanyId !== 'comp_atez'
      );
    }
    
    return [];
  }, [currentUser]);

  const columns = [
    {
      title: 'Kullanıcı İşlemleri',
      dataIndex: 'firstName',
      key: 'name',
      render: (text: string, record: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{record.firstName} {record.lastName}</span>
          <span className="text-xs text-slate-500">{record.email}</span>
        </div>
      ),
    },
    {
      title: 'Rol',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colors = {
          'ADMIN': 'red',
          'MUSAVIR': 'blue',
          'STANDART': 'default'
        };
        return <Tag color={colors[role as keyof typeof colors]}>{role}</Tag>;
      },
    },
    {
      title: 'Bağlı Olduğu Firma',
      dataIndex: 'primaryCompanyId',
      key: 'primaryCompanyId',
      render: (compId: string) => {
        const comp = mockCompanies.find(c => c.id === compId);
        return <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600 font-medium'}>{comp?.name || 'Bilinmiyor'}</span>;
      },
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
      title: 'Eylemler',
      key: 'actions',
      render: () => (
        <div className="flex gap-2">
          <Button size="small" type="link" className="text-blue-500 font-medium p-0">Düzenle</Button>
          <span className="text-slate-300">|</span>
          <Button size="small" type="link" className="text-red-500 font-medium p-0">Sil</Button>
        </div>
      ),
    },
  ];

  return (
    <PermissionGuard allowedRoles={['ADMIN', 'MUSAVIR']}>
      <div className={`p-6 md:p-8 min-h-screen ${isDarkMode ? 'bg-[#000]' : 'bg-[#fcfcfc]'}`}>
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold mb-2 flex items-center gap-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <TeamOutlined />
                </div>
                Kullanıcı Yönetimi
              </h1>
              <p className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                Platforma erişebilen kullanıcıları, rollerini ve firmalarını yönetin.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Input 
                placeholder="İsim veya E-posta..." 
                prefix={<SearchOutlined className="text-slate-400" />} 
                className="w-full md:w-56 rounded-lg"
              />
              <Select defaultValue="Tümü" className="w-32" options={[{ label: 'Tümü', value: 'Tümü' }, { label: 'Aktif', value: 'Aktif' }]} />
              <Button type="primary" icon={<PlusOutlined />} className="bg-indigo-600 hover:bg-indigo-700 rounded-lg border-0">
                Kullanıcı Davet Et
              </Button>
            </div>
          </div>

          {/* Table Container */}
          <div className={`rounded-xl border ${isDarkMode ? 'bg-[#141414] border-gray-800' : 'bg-white border-gray-100'} shadow-sm overflow-hidden`}>
            <Table 
              columns={columns} 
              dataSource={visibleUsers.map(u => ({ ...u, key: u.id }))} 
              pagination={{ pageSize: 15 }}
              className={`custom-table ${isDarkMode ? 'ant-table-dark' : ''}`}
            />
          </div>

        </div>
      </div>
    </PermissionGuard>
  );
}
