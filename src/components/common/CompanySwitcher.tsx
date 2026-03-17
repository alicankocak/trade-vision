import React from 'react';
import { Dropdown, MenuProps } from 'antd';
import { CaretDownOutlined, BankOutlined, ShopOutlined, CheckCircleFilled, DesktopOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/store/useAuthStore';
import { Company } from '@/data/mockAuthData';

export const CompanySwitcher: React.FC = () => {
  const { activeCompanyContext, availableCompanies, switchCompanyContext, currentUser } = useAuthStore();

  if (!currentUser || !activeCompanyContext) return null;

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    switchCompanyContext(e.key);
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'header',
      label: (
        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Erişilebilir Firmalar
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    ...availableCompanies.map((company: Company) => ({
      key: company.id,
      label: (
        <div className="flex items-center justify-between w-full min-w-[200px] py-1">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${company.type === 'SISTEM' ? 'bg-slate-100 text-slate-800' : company.type === 'GUMRUK' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
              {company.type === 'SISTEM' ? <DesktopOutlined /> : company.type === 'GUMRUK' ? <BankOutlined /> : <ShopOutlined />}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 line-clamp-1">{company.name}</span>
              <span className="text-xs text-gray-500">{company.taxNumber}</span>
            </div>
          </div>
          {activeCompanyContext.id === company.id && (
            <CheckCircleFilled className="text-green-500" />
          )}
        </div>
      ),
    }))
  ];

  return (
    <Dropdown menu={{ items: menuItems, onClick: handleMenuClick }} trigger={['click']} placement="bottomRight">
      <div className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10 group">
        <div className={`flex items-center justify-center w-8 h-8 rounded-lg shadow-sm ${activeCompanyContext.type === 'SISTEM' ? 'bg-slate-800' : activeCompanyContext.type === 'GUMRUK' ? 'bg-blue-600' : 'bg-orange-600'} text-white`}>
           {activeCompanyContext.type === 'SISTEM' ? <DesktopOutlined className="text-sm" /> : activeCompanyContext.type === 'GUMRUK' ? <BankOutlined className="text-sm" /> : <ShopOutlined className="text-sm" />}
        </div>
        <div className="flex flex-col overflow-hidden max-w-[150px]">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
            {activeCompanyContext.name}
          </span>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize truncate leading-tight">
            {activeCompanyContext.type === 'SISTEM' ? 'Sistem Sağlayıcı' : activeCompanyContext.type === 'GUMRUK' ? 'Gümrük Müşavirliği' : 'Ticaret Firması'}
          </span>
        </div>
        {availableCompanies.length > 1 && (
          <CaretDownOutlined className="text-gray-400 group-hover:text-gray-600 transition-colors text-[10px] ml-1" />
        )}
      </div>
    </Dropdown>
  );
};
