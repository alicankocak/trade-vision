import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import DeclarationList from './pages/DeclarationList';
import DeclarationDetail from './pages/DeclarationDetail';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Unauthorized from './pages/Unauthorized';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { DashboardProvider } from './context/DashboardContext';

// Placeholder Pages
const Archive = () => <div><h2>Arşiv</h2></div>;

const AppContent: React.FC = () => {
  const { isDarkMode } = useTheme();
  const { defaultAlgorithm, darkAlgorithm } = theme;

  // Dynamic Tokens based on Theme
  const themeTokens = isDarkMode ? {
    // Dark Mode Tokens (High Contrast)
    colorPrimary: '#ffffff',
    colorBgBase: '#000000', // Deep black
    colorBgLayout: '#000000', // Layout bg
    colorBgContainer: '#141414', // Card bg
    colorBorder: '#303030',
    colorSplit: '#303030',
    colorText: '#e6e6e6', // Soft white
    colorTextHeading: '#ffffff',
    controlOutline: 'rgba(255, 255, 255, 0.1)', // Remove blue focus glow
  } : {
    // Light Mode Tokens (Default)
    colorPrimary: '#000000',
    borderRadius: 8,
    colorBorder: '#e2e2e4',
    colorSplit: '#e2e2e4',
    colorBgContainer: '#ffffff',
    colorBgLayout: '#ffffff',
  };

  const componentTokens = isDarkMode ? {
    Menu: {
      itemSelectedBg: '#262626', // Clearly dark gray (was #303030)
      itemSelectedColor: '#ffffff', // Selected text
      itemBg: '#000000', // Menu container bg (Match sidebar)
      itemColor: '#a3a3a3', // Inactive text
    },
    Table: {
      rowSelectedBg: '#1f1f1f',
      rowSelectedHoverBg: '#262626',
      headerBg: '#1d1d1d', // Slightly lighter than card
      headerColor: '#e6e6e6',
      borderColor: '#303030',
      footerBg: '#1d1d1d',
    },
    Select: {
      controlItemBgActive: '#303030',
      controlItemBgHover: '#262626',
      optionSelectedColor: '#ffffff',
      selectorBg: '#141414',
      colorBorder: '#303030',
    },
    Input: {
      colorBgContainer: '#141414',
      colorBorder: '#303030',
      activeBorderColor: '#ffffff',
      hoverBorderColor: '#525252',
    },
    Card: {
      colorBgContainer: '#141414',
    },
    Drawer: {
      colorBgElevated: '#141414',
    },
    Modal: {
      contentBg: '#141414',
      headerBg: '#141414',
    },
    Tabs: {
      itemColor: '#a3a3a3',
      itemSelectedColor: '#ffffff',
      itemHoverColor: '#e6e6e6',
      inkBarColor: '#ffffff',
    }
  } : {
    Menu: {
      itemSelectedBg: '#f3f4f6',
      itemSelectedColor: '#000000',
    },
    Table: {
      rowSelectedBg: '#e8e8e8',
      rowSelectedHoverBg: '#d9d9d9',
      headerBg: '#fafafa',
    },
    Select: {
      controlItemBgActive: '#e8e8e8',
      controlItemBgHover: '#f3f4f6',
      optionSelectedColor: '#000000',
    },
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: themeTokens,
        components: componentTokens,
      }}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="declarations" element={<DeclarationList />} />
              <Route path="declarations/:id" element={<DeclarationDetail />} />
              <Route path="archive" element={<Archive />} />
              <Route path="users" element={<Users />} />
              <Route path="profile" element={<Profile />} />
              <Route path="unauthorized" element={<Unauthorized />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DashboardProvider>
          <AppContent />
        </DashboardProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App
