import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { useTheme } from '../../context/ThemeContext';

// Simple Icons
const Icons = {
    Down: () => <svg className="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>,
    Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    Close: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>,
    Edit: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
};

// ... imports
interface DashboardHeaderProps {
    extraLeft?: React.ReactNode;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ extraLeft }) => {
    const {
        isEditing,
        setEditing,
        currentDashboard,
        dashboards,
        switchDashboard,
        saveDashboard,
        addDashboard,
        setDrawerVisible
    } = useDashboard();

    const { isDarkMode } = useTheme();
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [newDashboardName, setNewDashboardName] = useState('');
    const [showNotification, setShowNotification] = useState(false);

    const handleSave = () => {
        if (!newDashboardName.trim()) return;
        saveDashboard(newDashboardName);
        setIsSaveModalOpen(false);
        setNewDashboardName('');

        // Show success notification
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
    };

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (val === 'new_dashboard_action') {
            const name = prompt("Yeni Dashboard Adı:");
            if (name) addDashboard(name);
        } else {
            switchDashboard(val);
        }
    };

    // Styles
    const bgClass = isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white';
    const borderClass = isDarkMode ? 'border-[#2d2d2d]' : 'border-[#e2e2e4]';
    const textClass = isDarkMode ? 'text-white' : 'text-gray-900';
    const inputClass = isDarkMode ? 'bg-[#141414] border-[#303030] text-white' : 'bg-white border-gray-300 text-black';

    return (
        <div className={`p-4 rounded-lg border shadow-sm flex flex-col md:flex-row justify-between items-center transition-colors duration-200 mb-6 ${bgClass} ${borderClass}`}>

            {/* Left: Segment Control / Extra Content */}
            <div className="flex items-center gap-4">
                {extraLeft}
            </div>

            {/* Right: Dashboard Selector & Actions */}
            <div className="flex items-center gap-4 ml-auto">
                {/* Selector moved here */}
                <div className="time-period-select relative">
                    <select
                        value={currentDashboard.id}
                        onChange={handleDropdownChange}
                        className={`appearance-none pl-3 pr-8 py-1.5 rounded border outline-none cursor-pointer font-semibold text-sm ${inputClass}`}
                    >
                        {dashboards.map(d => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                        <optgroup label="Aksiyonlar">
                            <option value="new_dashboard_action">+ Yeni Oluştur</option>
                        </optgroup>
                    </select>
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none opacity-50">
                        <Icons.Down />
                    </div>
                </div>

                {isEditing ? (
                    <>
                        <button
                            onClick={() => setDrawerVisible(true)}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium border transition-colors ${isDarkMode ? 'border-gray-600 text-gray-300 hover:text-white' : 'border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50'}`}
                        >
                            <Icons.Plus /> Widget Ekle
                        </button>

                        <button
                            onClick={() => setEditing(false)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors"
                        >
                            <Icons.Close /> İptal
                        </button>

                        <button
                            onClick={() => setIsSaveModalOpen(true)}
                            className="flex items-center gap-1 px-4 py-1.5 rounded text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-colors"
                        >
                            <Icons.Save /> Farklı Kaydet
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => setEditing(true)}
                        className={`flex items-center gap-1 px-4 py-1.5 rounded text-sm font-medium border transition-colors ${isDarkMode ? 'text-white border-gray-600 hover:border-white' : 'text-gray-700 border-gray-300 hover:bg-gray-50'}`}
                    >
                        <Icons.Edit /> Düzenle
                    </button>
                )}
            </div>

            {/* Save As Modal */}
            {isSaveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md p-6 rounded-lg shadow-2xl ${bgClass} ${textClass}`}>
                        <h3 className="text-lg font-bold mb-4">Dashboard'u Kaydet</h3>
                        <div className="mb-4">
                            <label className="block text-xs font-bold uppercase opacity-70 mb-1">Yeni İsim</label>
                            <input
                                type="text"
                                value={newDashboardName}
                                onChange={(e) => setNewDashboardName(e.target.value)}
                                placeholder="Örn: Operasyon 2026"
                                className={`w-full p-2 rounded border focus:ring-2 ring-blue-500 outline-none ${inputClass}`}
                                autoFocus
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsSaveModalOpen(false)}
                                className={`px-4 py-2 rounded text-sm font-medium ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!newDashboardName.trim()}
                                className="px-4 py-2 rounded text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Toast */}
            {showNotification && (
                <div className="fixed bottom-4 right-4 z-50 animate-bounce-in">
                    <div className="bg-green-600 text-white px-4 py-3 rounded shadow-lg flex items-center gap-2">
                        <Icons.Save />
                        <span className="font-bold">Dashboard başarıyla kaydedildi!</span>
                    </div>
                </div>
            )}

        </div>
    );
};

export default DashboardHeader;
