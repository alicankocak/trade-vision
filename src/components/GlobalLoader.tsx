'use client';

import React from 'react';
import { Spin } from 'antd';
import { useDashboard } from '@/context/DashboardContext';

const GlobalLoader: React.FC = () => {
    const { isGlobalChecking } = useDashboard();

    if (!isGlobalChecking) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center flex-col gap-4 backdrop-blur-sm">
            <Spin size="large" />
            <span className="text-white font-medium text-lg">Kontrol ediliyor...</span>
        </div>
    );
};

export default GlobalLoader;
