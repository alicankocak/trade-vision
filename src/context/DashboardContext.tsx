import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
// import type { Layout } from 'react-grid-layout';

// Define our own Layout interface to avoid type mismatch
export interface LayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    maxW?: number;
    minH?: number;
    maxH?: number;
    static?: boolean;
    isDraggable?: boolean;
    isResizable?: boolean;
}

export interface Layouts {
    [key: string]: LayoutItem[];
}

// Widget Types
export interface Widget {
    id: string;
    title: string;
    type: 'kpi' | 'chart' | 'list' | 'custom';
    componentKey: string;
    defaultW: number;
    defaultH: number;
    category: 'Risk' | 'Analiz' | 'Genel' | 'Diğer';
}

export type Segment = 'B2B' | 'B2C'

export interface DashboardConfig {
    id: string;
    name: string;
    layouts: {
        B2B: Layouts;
        B2C: Layouts;
    };
    widgets: {
        B2B: string[];
        B2C: string[];
    };
}

interface DashboardContextType {
    isEditing: boolean;
    setEditing: (editing: boolean) => void;
    activeSegment: Segment;
    setActiveSegment: (segment: Segment) => void;
    currentDashboard: DashboardConfig;
    dashboards: DashboardConfig[];
    switchDashboard: (id: string) => void;
    saveDashboard: (name?: string) => void;
    addDashboard: (name: string) => void;
    updateLayouts: (layouts: Layouts) => void;
    addWidget: (widgetId: string) => void;
    removeWidget: (widgetId: string) => void;
    availableWidgets: Widget[];
    drawerVisible: boolean;
    setDrawerVisible: (visible: boolean) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

// Initial/Default Widgets Definition
export const AVAILABLE_WIDGETS: Widget[] = [
    { id: 'kpi-total', title: 'Toplam Beyanname', type: 'kpi', componentKey: 'KpiTotal', defaultW: 1, defaultH: 4, category: 'Genel' },
    { id: 'kpi-absolute', title: 'Mutlak Risk', type: 'kpi', componentKey: 'KpiAbsolute', defaultW: 1, defaultH: 4, category: 'Risk' },
    { id: 'kpi-potential', title: 'Potansiyel Risk', type: 'kpi', componentKey: 'KpiPotential', defaultW: 1, defaultH: 4, category: 'Risk' },
    { id: 'kpi-ai', title: 'AI-ML Bulgusu', type: 'kpi', componentKey: 'KpiAi', defaultW: 1, defaultH: 4, category: 'Risk' },
    { id: 'kpi-intac', title: 'İntaç Bekleyen', type: 'kpi', componentKey: 'KpiIntac', defaultW: 1, defaultH: 4, category: 'Genel' },
    { id: 'chart-risk-overview', title: 'Risk Analiz Genel Bakış', type: 'chart', componentKey: 'ChartRiskOverview', defaultW: 5, defaultH: 14, category: 'Analiz' },
    { id: 'chart-trend', title: 'Haftalık Trend', type: 'chart', componentKey: 'ChartTrend', defaultW: 3, defaultH: 10, category: 'Analiz' },
    { id: 'chart-risk-pie', title: 'Risk Dağılımı', type: 'chart', componentKey: 'ChartRiskPie', defaultW: 2, defaultH: 10, category: 'Risk' },
    { id: 'list-intac', title: 'İntaç Bekleyen Liste', type: 'list', componentKey: 'ListIntac', defaultW: 2, defaultH: 8, category: 'Genel' },
    { id: 'list-risk-top', title: 'En Çok Risk İçerenler', type: 'list', componentKey: 'ListRiskTop', defaultW: 3, defaultH: 8, category: 'Risk' },
];

const DEFAULT_LAYOUT_LG: LayoutItem[] = [
    { i: 'kpi-total', x: 0, y: 0, w: 1, h: 4 },
    { i: 'kpi-absolute', x: 1, y: 0, w: 1, h: 4 },
    { i: 'kpi-potential', x: 2, y: 0, w: 1, h: 4 },
    { i: 'kpi-ai', x: 3, y: 0, w: 1, h: 4 },
    { i: 'kpi-intac', x: 4, y: 0, w: 1, h: 4 },
    { i: 'chart-risk-overview', x: 0, y: 4, w: 5, h: 14 },
    { i: 'chart-trend', x: 0, y: 14, w: 3, h: 10 },
    { i: 'chart-risk-pie', x: 3, y: 14, w: 2, h: 10 },
    { i: 'list-intac', x: 0, y: 24, w: 2, h: 8 },
    { i: 'list-risk-top', x: 2, y: 24, w: 3, h: 8 },
];

// B2C has a slightly simplified default layout
const DEFAULT_LAYOUT_LG_B2C: LayoutItem[] = [
    { i: 'kpi-total', x: 0, y: 0, w: 1, h: 4 },
    { i: 'kpi-ai', x: 1, y: 0, w: 1, h: 4 }, // Fewer KPIs
    { i: 'chart-risk-overview', x: 0, y: 4, w: 4, h: 12 },
    { i: 'list-risk-top', x: 4, y: 4, w: 2, h: 12 },
];

const DEFAULT_DASHBOARD: DashboardConfig = {
    id: 'default',
    name: 'Varsayılan Dashboard',
    layouts: {
        B2B: { lg: DEFAULT_LAYOUT_LG },
        B2C: { lg: DEFAULT_LAYOUT_LG_B2C }
    },
    widgets: {
        B2B: AVAILABLE_WIDGETS.map(w => w.id),
        B2C: ['kpi-total', 'kpi-ai', 'chart-risk-overview', 'list-risk-top']
    }
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isEditing, setEditing] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [activeSegment, setActiveSegment] = useState<Segment>('B2B');
    const [dashboards, setDashboards] = useState<DashboardConfig[]>([DEFAULT_DASHBOARD]);
    const [currentDashboardId, setCurrentDashboardId] = useState<string>('default');

    useEffect(() => {
        try {
            const saved = localStorage.getItem('tradevision_dashboards');
            const savedId = localStorage.getItem('tradevision_current_dashboard');

            if (savedId) {
                setCurrentDashboardId(savedId);
            }

            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && Array.isArray(parsed) && parsed.length > 0) {
                    const first = parsed[0];
                    if (first.layouts && !first.layouts.B2B) {
                        console.log("Migrating dashboard to Segment format...");
                        setDashboards([{
                            ...first,
                            layouts: { B2B: first.layouts, B2C: { lg: DEFAULT_LAYOUT_LG_B2C } },
                            widgets: { B2B: first.widgets || [], B2C: DEFAULT_DASHBOARD.widgets.B2C }
                        }]);
                    } else {
                        setDashboards(parsed);
                    }
                }
            }
        } catch (e) {
            console.error("Failed to load dashboards", e);
        }
    }, []);

    const currentDashboard = useMemo(() => {
        // SAFE MODE: Bypass logic to ensure render
        return DEFAULT_DASHBOARD;

        /* 
        const found = dashboards.find(d => d.id === currentDashboardId);
        const active = found || dashboards[0] || DEFAULT_DASHBOARD;
        if (!active.layouts || !active.layouts.B2B) {
             return DEFAULT_DASHBOARD; // Fallback if migration failed/data corrupt
        }
        return active;
        */
    }, [dashboards, currentDashboardId]);

    useEffect(() => {
        // In Safe Mode, we don't accidentally overwrite good data with default
        // But if we were active, we'd save here.
        // localStorage.setItem('tradevision_dashboards', JSON.stringify(dashboards));
        // localStorage.setItem('tradevision_current_dashboard', currentDashboardId);
    }, [dashboards, currentDashboardId]);

    const switchDashboard = (id: string) => {
        setCurrentDashboardId(id);
    };

    const saveDashboard = (name?: string) => {
        if (name) {
            // Save As New
            const newDashboard: DashboardConfig = {
                id: `dash-${Date.now()}`,
                name,
                layouts: JSON.parse(JSON.stringify(currentDashboard.layouts)),
                widgets: JSON.parse(JSON.stringify(currentDashboard.widgets)),
            };
            setDashboards([...dashboards, newDashboard]);
            setCurrentDashboardId(newDashboard.id);
        } else {
            setEditing(false);
        }
    };

    const addDashboard = (name: string) => {
        const newDashboard: DashboardConfig = {
            id: `dash-${Date.now()}`,
            name,
            layouts: JSON.parse(JSON.stringify(DEFAULT_DASHBOARD.layouts)),
            widgets: JSON.parse(JSON.stringify(DEFAULT_DASHBOARD.widgets)),
        };
        setDashboards([...dashboards, newDashboard]);
        setCurrentDashboardId(newDashboard.id);
    };

    const updateLayouts = (layouts: Layouts) => {
        setDashboards(prev => prev.map(d =>
            d.id === currentDashboardId ? {
                ...d,
                layouts: {
                    ...d.layouts,
                    [activeSegment]: layouts
                }
            } : d
        ));
    };

    const addWidget = (widgetId: string) => {
        const widgetDef = AVAILABLE_WIDGETS.find(w => w.id === widgetId);
        if (!widgetDef) return;

        setDashboards(prev => prev.map(d => {
            if (d.id !== currentDashboardId) return d;

            const segmentWidgets = d.widgets[activeSegment] || [];
            if (segmentWidgets.includes(widgetId)) return d;

            const newWidgets = {
                ...d.widgets,
                [activeSegment]: [...segmentWidgets, widgetId]
            };

            // Add to layout
            const newLayoutItem: LayoutItem = {
                i: widgetId,
                x: 0,
                y: 0,
                w: widgetDef.defaultW,
                h: widgetDef.defaultH
            };

            const segmentLayouts = d.layouts[activeSegment];
            const newSegmentLayouts = { ...segmentLayouts };

            Object.keys(newSegmentLayouts).forEach(bp => {
                newSegmentLayouts[bp] = [...newSegmentLayouts[bp], newLayoutItem];
            });

            if (!newSegmentLayouts.lg) newSegmentLayouts.lg = [...(DEFAULT_LAYOUT_LG), newLayoutItem];

            return {
                ...d,
                widgets: newWidgets,
                layouts: {
                    ...d.layouts,
                    [activeSegment]: newSegmentLayouts
                }
            };
        }));
    };

    const removeWidget = (widgetId: string) => {
        setDashboards(prev => prev.map(d => {
            if (d.id !== currentDashboardId) return d;

            const newWidgets = {
                ...d.widgets,
                [activeSegment]: d.widgets[activeSegment].filter(w => w !== widgetId)
            };

            const segmentLayouts = d.layouts[activeSegment];
            const newSegmentLayouts = { ...segmentLayouts };
            Object.keys(newSegmentLayouts).forEach(bp => {
                newSegmentLayouts[bp] = newSegmentLayouts[bp].filter(l => l.i !== widgetId);
            });

            return {
                ...d,
                widgets: newWidgets,
                layouts: {
                    ...d.layouts,
                    [activeSegment]: newSegmentLayouts
                }
            };
        }));
    };

    return (
        <DashboardContext.Provider value={{
            isEditing,
            setEditing,
            activeSegment,
            setActiveSegment,
            currentDashboard,
            dashboards,
            switchDashboard,
            saveDashboard,
            addDashboard,
            updateLayouts,
            addWidget,
            removeWidget,
            availableWidgets: AVAILABLE_WIDGETS,
            drawerVisible,
            setDrawerVisible
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};
