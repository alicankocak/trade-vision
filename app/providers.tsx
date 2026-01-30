'use client';

import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { DashboardProvider } from '@/context/DashboardContext';
import ErrorBoundary from '@/components/ErrorBoundary';

const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
    const { isDarkMode } = useTheme();
    const { defaultAlgorithm, darkAlgorithm } = theme;

    const themeTokens = isDarkMode ? {
        colorPrimary: '#ffffff',
        colorBgBase: '#000000',
        colorBgLayout: '#000000',
        colorBgContainer: '#141414',
        colorBorder: '#303030',
        colorSplit: '#303030',
        colorText: '#e6e6e6',
        colorTextHeading: '#ffffff',
        controlOutline: 'rgba(255, 255, 255, 0.1)',
    } : {
        colorPrimary: '#000000',
        borderRadius: 8,
        colorBorder: '#e2e2e4',
        colorSplit: '#e2e2e4',
        colorBgContainer: '#ffffff',
        colorBgLayout: '#ffffff',
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
                token: themeTokens,
            }}
        >
            <DashboardProvider>
                {children}
            </DashboardProvider>
        </ConfigProvider>
    );
};

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <ThemeWrapper>
                        {children}
                    </ThemeWrapper>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}
