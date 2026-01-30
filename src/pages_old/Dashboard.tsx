import React, { useMemo, useEffect, useState } from 'react';
// import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import { useDashboard, AVAILABLE_WIDGETS } from '../context/DashboardContext';
import type { Layouts } from '../context/DashboardContext';
import { useTheme } from '../context/ThemeContext';
import WidgetDrawer from '../components/dashboard/WidgetDrawer';
import DashboardHeader from '../components/dashboard/DashboardHeader';

// const ResponsiveGridLayout = WidthProvider(Responsive);

// Simple SVG Icons
const Icons = {
    Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    Drag: () => <svg className="w-4 h-4 cursor-grab" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
};

const Dashboard: React.FC = () => {
    const { isDarkMode } = useTheme();
    const {
        isEditing,
        currentDashboard,
        removeWidget,
        // updateLayouts, // Unused in Safe Mode
        // dashboards,
        // switchDashboard,
        setDrawerVisible,
        setEditing,
        activeSegment,
        setActiveSegment
    } = useDashboard();

    // --- Styles ---
    const bgClass = isDarkMode ? 'bg-[#141414]' : 'bg-white';
    const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
    const cardClass = `h-full p-4 rounded-lg shadow-sm border transition-all ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030]' : 'bg-white border-gray-200'} relative overflow-hidden flex flex-col`;

    console.log("RENDER TEST: Current Dashboard Data:", currentDashboard);

    if (!currentDashboard) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-lg font-semibold">Dashboard Yükleniyor... (Safe Mode)</div>
            </div>
        );
    }

    // Resolve current data based on segment (Safe Mode / Migration Safety)
    // Resolve current data based on segment (Safe Mode / Migration Safety)
    console.log("DEBUG: Segment", activeSegment, "Widgets:", currentDashboard.widgets);

    let activeWidgets: string[] = [];
    if (currentDashboard.widgets && !Array.isArray(currentDashboard.widgets)) {
        // New Object Structure
        activeWidgets = (currentDashboard.widgets as any)[activeSegment] || [];
    } else if (Array.isArray(currentDashboard.widgets)) {
        // Old Array Structure (Fallback)
        activeWidgets = currentDashboard.widgets;
    }

    // If we re-enable RGL later, we would use currentDashboard.layouts[activeSegment]

    const renderWidgetMock = (_widgetId: string, type: string) => {
        // Mock Data Variation based on Segment
        const multiplier = activeSegment === 'B2B' ? 1 : 0.6; // B2C has generic lower numbers for demo

        if (type === 'kpi') {
            const val = Math.floor(1248 * multiplier);
            return (
                <div className="flex flex-col h-full justify-between min-h-[60px]">
                    <div className="flex justify-between items-center mb-1">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>KPI</span>
                        <span className="text-[10px] opacity-50">{activeSegment}</span>
                    </div>
                    <div>
                        <div className={`text-2xl font-bold ${textClass}`}>{val.toLocaleString()}</div>
                        <div className={`text-[10px] uppercase tracking-wide mt-0.5 opacity-60 ${textClass}`}>Değer</div>
                    </div>
                </div>
            );
        }
        if (type === 'chart') {
            return (
                <div className="flex-1 flex items-center justify-center bg-gray-50/5 rounded border border-dashed border-gray-500/30 min-h-[100px]">
                    <span className="text-xs opacity-50">Grafik Alanı ({activeSegment})</span>
                </div>
            );
        }
        return (
            <div className="flex flex-col gap-2 overflow-y-auto">
                {[1, 2, 3].map(i => (
                    <div key={i} className={`p-2 rounded border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-gray-50'}`}>
                        <div className="text-xs opacity-70">Item {i} ({activeSegment})</div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className={`min-h-screen p-4 ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`}>
            <DashboardHeader
                extraLeft={
                    <div className={`p-1 rounded-lg inline-flex ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200/50'}`}>
                        <button
                            onClick={() => setActiveSegment('B2B')}
                            className={`px-6 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeSegment === 'B2B'
                                ? (isDarkMode ? 'bg-[#303030] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            B2B
                        </button>
                        <button
                            onClick={() => setActiveSegment('B2C')}
                            className={`px-6 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeSegment === 'B2C'
                                ? (isDarkMode ? 'bg-[#303030] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm')
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            B2C
                        </button>
                    </div>
                }
            />

            {/* SAFE MODE: Standard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {activeWidgets.map(widgetId => {
                    const widgetDef = AVAILABLE_WIDGETS?.find(w => w.id === widgetId);
                    if (!widgetDef) return <div key={widgetId} className="hidden">Mock Widget {widgetId}</div>;

                    // Manual Span Logic for standard grid
                    const colSpan = widgetDef.defaultW >= 4 ? 'col-span-1 md:col-span-2 lg:col-span-4' :
                        widgetDef.defaultW >= 3 ? 'col-span-1 md:col-span-2 lg:col-span-3' :
                            widgetDef.defaultW >= 2 ? 'col-span-1 md:col-span-2 lg:col-span-2' : 'col-span-1';

                    return (
                        <div key={widgetId} className={`${colSpan} ${cardClass} min-h-[150px]`}>
                            {/* Header */}
                            <div className="flex justify-between items-start mb-2 shrink-0">
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <h3 className={`font-semibold truncate ${textClass} text-sm`}>{widgetDef.title}</h3>
                                </div>
                                {isEditing && (
                                    <button
                                        onClick={() => removeWidget(widgetId)}
                                        className="text-red-400 hover:text-red-600 p-0.5 rounded hover:bg-red-50/10 transition-colors"
                                    >
                                        <Icons.Trash />
                                    </button>
                                )}
                            </div>

                            {/* Widget Content */}
                            <div className="flex-1 overflow-hidden">
                                {renderWidgetMock(widgetId, widgetDef.type)}
                            </div>
                        </div>
                    );
                })}
            </div>

            {(!activeWidgets || activeWidgets.length === 0) && (
                <div className={`p-10 text-center rounded border border-dashed m-4 ${isDarkMode ? 'border-gray-800 text-gray-500' : 'border-gray-300 text-gray-400'}`}>
                    {activeSegment} Dashboard Boş. "Düzenle" moduna geçip widget ekleyebilirsiniz.
                </div>
            )}

            <WidgetDrawer />
        </div>
    );
};

export default Dashboard;
