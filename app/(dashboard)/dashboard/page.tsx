'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Button, Dropdown, MenuProps, Input, Drawer, Checkbox, message, Segmented } from 'antd';
import {
    PlusOutlined,
    EditOutlined,
    SaveOutlined,
    CloseOutlined,
    AppstoreAddOutlined,
    DownOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableWidget } from '@/components/dashboard/SortableWidget';
import { WIDGET_REGISTRY } from '@/utils/widgetRegistry';

// Types
interface DashboardLayout {
    id: string;
    name: string;
    widgets: { id: string; type: string; colSpan?: number; rowSpan?: number }[];
}

const DEFAULT_WIDGETS_B2B = [
    { id: 'w1', type: 'stat_checkin', colSpan: 3, rowSpan: 3 },
    { id: 'w2', type: 'stat_checkout', colSpan: 3, rowSpan: 3 },
    { id: 'w3', type: 'stat_guests', colSpan: 3, rowSpan: 3 },
    { id: 'w4', type: 'stat_amount', colSpan: 3, rowSpan: 3 },
    { id: 'w5', type: 'chart_risk_summary', colSpan: 6, rowSpan: 8 },
    { id: 'w6', type: 'chart_campaign', colSpan: 6, rowSpan: 8 },
    { id: 'w7', type: 'chart_pipeline', colSpan: 6, rowSpan: 8 },
];

const DEFAULT_WIDGETS_B2C = [
    { id: 'w4', type: 'stat_amount', colSpan: 3, rowSpan: 3 },
    { id: 'w3', type: 'stat_guests', colSpan: 3, rowSpan: 3 },
    { id: 'w6', type: 'chart_campaign', colSpan: 6, rowSpan: 8 },
    { id: 'w1', type: 'stat_checkin', colSpan: 3, rowSpan: 3 },
];

const MOCK_SAVED_DASHBOARDS: DashboardLayout[] = [
    { id: 'default_b2b', name: 'Varsayılan B2B Görünüm', widgets: [...DEFAULT_WIDGETS_B2B] },
    { id: 'default_b2c', name: 'Varsayılan B2C Görünüm', widgets: [...DEFAULT_WIDGETS_B2C] },
];

const Dashboard: React.FC = () => {
    const { isDarkMode } = useTheme();
    const [activeSegment, setActiveSegment] = useState<'B2B' | 'B2C'>('B2B');

    // --- State for separate layouts ---
    const [layouts, setLayouts] = useState<{ B2B: { id: string; type: string; colSpan?: number; rowSpan?: number }[], B2C: { id: string; type: string; colSpan?: number; rowSpan?: number }[] }>({
        B2B: [...DEFAULT_WIDGETS_B2B],
        B2C: [...DEFAULT_WIDGETS_B2C]
    });

    // --- Edit Mode States ---
    const [isEditing, setIsEditing] = useState(false);
    const [dashboardName, setDashboardName] = useState('My Dashboard');
    const [savedDashboards, setSavedDashboards] = useState(MOCK_SAVED_DASHBOARDS);
    const [widgetsDrawerOpen, setWidgetsDrawerOpen] = useState(false);

    // Derived state for current view
    const widgets = layouts[activeSegment];

    // Helper to update current segment's widgets
    const setWidgets = (updater: (prev: { id: string; type: string; colSpan?: number; rowSpan?: number }[]) => { id: string; type: string; colSpan?: number; rowSpan?: number }[]) => {
        setLayouts(prev => ({
            ...prev,
            [activeSegment]: updater(prev[activeSegment])
        }));
    };

    // DnD Sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // --- Mock Data for Content ---
    const dashboardData = {
        B2B: {
            checkIn: { value: '1,245', sub: 'Bulgu Sayısı: 12' },
            checkOut: { value: '45', sub: 'Bulgu Sayısı: 5' },
            guests: { value: '128', sub: 'Bulgu Sayısı: 8' },
            amount: { value: '892', sub: 'Bulgu Sayısı: 42' },
        },
        B2C: {
            checkIn: { value: '8,450', sub: 'Bulgu Sayısı: 156' },
            checkOut: { value: '120', sub: 'Bulgu Sayısı: 14' },
            guests: { value: '3,200', sub: 'Bulgu Sayısı: 98' },
            amount: { value: '1,500', sub: 'Bulgu Sayısı: 210' },
        }
    };
    const currentData = dashboardData[activeSegment];

    // --- Handlers ---

    // Reset or Switch logic
    // When segment changes, the 'widgets' variable automatically updates due to strict React rendering of derived state.

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setWidgets((items) => {
                const oldIndex = items.findIndex(i => i.id === active.id);
                const newIndex = items.findIndex(i => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleResize = (widgetId: string, newColSpan: number) => {
        setWidgets(prev => prev.map(w =>
            w.id === widgetId ? { ...w, colSpan: newColSpan } : w
        ));
    };

    const handleResizeHeight = (widgetId: string, newRowSpan: number) => {
        setWidgets(prev => prev.map(w =>
            w.id === widgetId ? { ...w, rowSpan: newRowSpan } : w
        ));
    };

    const handleSave = () => {
        setIsEditing(false);
        const newLayout: DashboardLayout = {
            id: Date.now().toString(),
            name: `${dashboardName} (${activeSegment})`,
            widgets: [...widgets]
        };
        setSavedDashboards(prev => [...prev, newLayout]);
        message.success(`${activeSegment} görünümü kaydedildi!`);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Ideally revert changes if we were tracking initial state on edit start
        message.info('Düzenleme iptal edildi.');
    };

    const handleLoadDashboard = (layout: DashboardLayout) => {
        // When loading a dashboard, we apply it to the CURRENT segment
        setWidgets(() => [...layout.widgets]);
        setDashboardName(layout.name);
        message.success(`"${layout.name}" yüklendi.`);
    };

    const toggleWidget = (type: string, checked: boolean) => {
        if (checked) {
            // Default span from registry
            const defaultSpan = WIDGET_REGISTRY[type]?.defaultColSpan || 1;
            const defaultRow = 5; // Default height for new widgets
            setWidgets(prev => [...prev, { id: `new_${Date.now()}`, type, colSpan: defaultSpan, rowSpan: defaultRow }]);
        } else {
            // Remove first instance of this type
            setWidgets(prev => prev.filter(w => w.type !== type));
        }
    };

    // --- Render Helpers ---

    const renderWidget = (widget: { id: string, type: string, colSpan?: number, rowSpan?: number }) => {
        const registryItem = WIDGET_REGISTRY[widget.type];
        if (!registryItem) return null;

        const { component: WidgetComponent, defaultProps, defaultColSpan } = registryItem;

        // Use stored colSpan or default from registry
        const currentSpan = widget.colSpan || defaultColSpan || 1;
        const currentRow = widget.rowSpan || 4; // Default if missing

        // Merge props
        const dynamicProps = defaultProps.propMap ? defaultProps.propMap(currentData) : {};
        const colorProps = defaultProps.colors ? defaultProps.colors(isDarkMode) : {};

        return (
            <SortableWidget
                key={widget.id}
                id={widget.id}
                isEditing={isEditing}
                colSpan={currentSpan}
                rowSpan={currentRow}
                onResize={(newSpan) => handleResize(widget.id, newSpan)}
                onResizeHeight={(newRow) => handleResizeHeight(widget.id, newRow)}
            >
                <WidgetComponent
                    {...defaultProps}
                    {...dynamicProps}
                    {...colorProps}
                    isDarkMode={isDarkMode}
                    colSpan={currentSpan}
                    // Pass legacy styles for charts
                    borderClass={isDarkMode ? 'border-[#303030]' : 'border-[#E3E3E7]'}
                    textClass={isDarkMode ? 'text-white' : 'text-slate-800'}
                    subTextClass={isDarkMode ? 'text-gray-400' : 'text-slate-500'}
                    cardBg={isDarkMode ? 'bg-[#1f1f1f]' : 'bg-white'}
                />
            </SortableWidget>
        );
    };

    // --- Dropdown Menu ---
    const dashboardMenu: MenuProps['items'] = savedDashboards.map(d => ({
        key: d.id,
        label: d.name,
        onClick: () => handleLoadDashboard(d)
    }));

    return (
        <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-black' : 'bg-[#fcfcfc]'} relative`}>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        {isEditing ? (
                            <Input
                                value={dashboardName}
                                onChange={(e) => setDashboardName(e.target.value)}
                                className={`text-xl font-bold w-64 ${isDarkMode ? 'bg-[#1f1f1f] border-[#303030] text-white' : ''}`}
                            />
                        ) : (
                            <div className="flex items-center gap-2">
                                <h1 className={`text-2xl font-bold m-0 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                    {dashboardName}
                                </h1>
                                <Dropdown menu={{ items: dashboardMenu }} trigger={['click']}>
                                    <Button type="text" shape="circle" icon={<DownOutlined />} />
                                </Dropdown>
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => setIsEditing(true)}
                                    className="opacity-50 hover:opacity-100"
                                />
                            </div>
                        )}
                    </div>

                    <Segmented
                        options={[
                            { label: 'B2B', value: 'B2B' },
                            { label: 'B2C', value: 'B2C' }
                        ]}
                        value={activeSegment}
                        onChange={(val) => setActiveSegment(val as 'B2B' | 'B2C')}
                    />
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-3">
                        <Button
                            icon={<AppstoreAddOutlined />}
                            onClick={() => setWidgetsDrawerOpen(true)}
                        >
                            Widgets
                        </Button>
                        <Button onClick={handleCancel}>
                            Vazgeç
                        </Button>
                        <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} className="bg-black">
                            Kaydet
                        </Button>
                    </div>
                ) : null}

            </div>

            {/* Drag and Drop Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={widgets.map(w => w.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 auto-rows-[46px] gap-6 pb-20">
                        {widgets.map(widget => renderWidget(widget))}
                    </div>
                </SortableContext>
            </DndContext>


            {/* Widgets Drawer */}
            <Drawer
                title="Panel Widgetları"
                placement="right"
                onClose={() => setWidgetsDrawerOpen(false)}
                open={widgetsDrawerOpen}
                mask={false}
                width={320}
                headerStyle={{ backgroundColor: isDarkMode ? '#141414' : '#fff', borderBottom: isDarkMode ? '1px solid #303030' : '1px solid #f0f0f0' }}
                bodyStyle={{ backgroundColor: isDarkMode ? '#141414' : '#fff' }}
            >
                <div className="flex flex-col gap-4">
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Eklemek BÜTÜN istediğiniz kartları seçiniz:</span>

                    {Object.keys(WIDGET_REGISTRY).map(type => {
                        // Check if at least one instance exists
                        const isChecked = widgets.some(w => w.type === type);
                        return (
                            <div key={type} className={`p-3 rounded border flex items-center justify-between ${isDarkMode ? 'border-[#303030]' : 'border-gray-100'}`}>
                                <span className={isDarkMode ? 'text-white' : 'text-black'}>
                                    {type.replace('stat_', 'İstatistik: ').replace('chart_', 'Grafik: ')}
                                </span>
                                <Checkbox
                                    checked={isChecked}
                                    onChange={(e) => toggleWidget(type, e.target.checked)}
                                />
                            </div>
                        );
                    })}
                </div>
            </Drawer>
        </div>
    );
};

export default Dashboard;

