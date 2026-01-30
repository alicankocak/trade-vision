import React, { useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import type { Widget } from '../../context/DashboardContext';
import { useTheme } from '../../context/ThemeContext';

// Simple Icons
const Icons = {
    Close: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Check: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
    Kpi: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
};

const WidgetDrawer: React.FC = () => {
    const { drawerVisible, setDrawerVisible, availableWidgets, addWidget, currentDashboard, activeSegment } = useDashboard();
    const { isDarkMode } = useTheme();

    if (!drawerVisible) return null;

    // Determine if widget is already on dashboard
    const isAdded = (id: string) => {
        if (!currentDashboard || !currentDashboard.widgets || !currentDashboard.widgets[activeSegment]) return false;
        return currentDashboard.widgets[activeSegment].includes(id);
    };

    // Group widgets by category
    const groupedWidgets = useMemo(() => {
        const groups: Record<string, Widget[]> = {};
        if (!availableWidgets || !Array.isArray(availableWidgets)) {
            return groups;
        }
        availableWidgets.forEach(w => {
            if (!groups[w.category]) groups[w.category] = [];
            groups[w.category].push(w);
        });
        return groups;
    }, [availableWidgets]);

    const bgClass = isDarkMode ? 'bg-[#141414]' : 'bg-white';
    const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
    const borderClass = isDarkMode ? 'border-[#303030]' : 'border-gray-200';

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={() => setDrawerVisible(false)}
            />

            {/* Drawer Content */}
            <div className={`relative w-96 h-full shadow-2xl flex flex-col transition-transform transform translate-x-0 ${bgClass} ${textClass}`}>
                {/* Header */}
                <div className={`p-4 border-b flex justify-between items-center ${borderClass}`}>
                    <h2 className="text-lg font-bold">Widget Ekle</h2>
                    <button
                        onClick={() => setDrawerVisible(false)}
                        className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors`}
                    >
                        <Icons.Close />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {Object.keys(groupedWidgets).map(category => (
                        <div key={category}>
                            <h3 className={`text-xs font-bold uppercase tracking-wider mb-3 opacity-60`}>{category}</h3>
                            <div className="space-y-3">
                                {groupedWidgets[category].map(widget => (
                                    <div
                                        key={widget.id}
                                        className={`p-3 rounded-lg border flex items-center justify-between group transition-all ${isDarkMode ? 'border-gray-800 bg-[#1f1f1f] hover:border-gray-600' : 'border-gray-200 bg-gray-50 hover:border-gray-300'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded ${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-100'}`}>
                                                <Icons.Kpi />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">{widget.title}</div>
                                                <div className="text-xs opacity-50">{widget.type.toUpperCase()} • {widget.defaultW}x{widget.defaultH}</div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => addWidget(widget.id)}
                                            disabled={isAdded(widget.id)}
                                            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-colors ${isAdded(widget.id)
                                                ? 'bg-transparent text-green-500 cursor-default'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                                }`}
                                        >
                                            {isAdded(widget.id) ? (
                                                <>
                                                    <Icons.Check /> Eklendi
                                                </>
                                            ) : (
                                                <>
                                                    <Icons.Plus /> Ekle
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WidgetDrawer;
