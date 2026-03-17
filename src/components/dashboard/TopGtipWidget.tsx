import React from 'react';
import { Button, Dropdown, Tooltip as AntdTooltip } from 'antd';
import { 
    CalendarOutlined, 
    DownOutlined, 
    DoubleRightOutlined,
    BarChartOutlined,
    NumberOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { mockGtipUsage } from '@/data/mockGtipData';
import { useAuthStore } from '@/store/useAuthStore';

interface TopGtipWidgetProps {
    isDarkMode: boolean;
    cardBg: string;
    borderClass: string;
    textClass: string;
    subTextClass: string;
}

export const TopGtipWidget: React.FC<TopGtipWidgetProps> = ({ 
    isDarkMode, 
    cardBg, 
    borderClass, 
    textClass, 
    subTextClass 
}) => {
    const router = useRouter();
    const { activeCompanyContext } = useAuthStore();
    const [selectedYear, setSelectedYear] = React.useState(2024);

    const yearMenu = {
        items: [
            { key: '2024', label: '2024', onClick: () => setSelectedYear(2024) },
            { key: '2023', label: '2023', onClick: () => setSelectedYear(2023) },
        ]
    };

    // Filter and sort data
    const filteredData = mockGtipUsage
        .filter(item => item.companyId === activeCompanyContext?.id && item.year === selectedYear)
        .sort((a, b) => b.usageCount - a.usageCount)
        .slice(0, 10);

    return (
        <div className={`p-6 rounded-[8px] border ${isDarkMode ? 'border-gray-800 bg-[#1f1f1f]' : 'border-gray-100 bg-white'} h-full flex flex-col shadow-sm overflow-hidden`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <BarChartOutlined className="text-blue-500 text-lg" />
                    <h3 className={`font-bold text-[16px] m-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>En Çok Kullanılan GTIP'ler</h3>
                </div>
                <Dropdown menu={yearMenu} trigger={['click']}>
                    <Button size="small" className={`flex items-center gap-2 font-medium ${isDarkMode ? 'bg-zinc-800 border-zinc-700 text-white hover:text-blue-400' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'} shadow-sm rounded-lg px-3 py-1 text-xs`}>
                        <CalendarOutlined /> {selectedYear} <DownOutlined style={{ fontSize: '8px' }} />
                    </Button>
                </Dropdown>
            </div>

            {/* List */}
            <div className="flex flex-col gap-1 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {filteredData.length > 0 ? (
                    filteredData.map((item, index) => (
                        <div 
                            key={item.id} 
                            className={`flex items-center justify-between p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-bold w-5 ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>{index + 1}.</span>
                                <div className="flex flex-col">
                                    <span className={`font-bold text-sm ${isDarkMode ? 'text-zinc-200' : 'text-gray-800'}`}>{item.gtipNo}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`font-bold text-base ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{item.usageCount.toLocaleString('tr-TR')}</span>
                                <span className={`text-[10px] ${isDarkMode ? 'text-zinc-500' : 'text-gray-400'}`}>Kullanım</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 opacity-50">
                        <NumberOutlined className="text-4xl mb-2" />
                        <span className="text-sm">Bu yıl için veri bulunamadı.</span>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                <Button 
                    type="link" 
                    block 
                    icon={<DoubleRightOutlined className="text-xs" />}
                    className="flex items-center justify-center gap-1 text-blue-500 font-bold hover:text-blue-600 p-0 h-auto"
                    onClick={() => router.push('/gtip-list')}
                >
                    Tümünü Göster
                </Button>
            </div>
        </div>
    );
};
