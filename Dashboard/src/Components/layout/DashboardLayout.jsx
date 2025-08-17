// src/Components/layout/DashboardLayout.jsx
import React, { useState } from 'react';
import { HomeIcon } from '../icons/HomeIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { BarChartIcon } from '../icons/BarChartIcon';
import { LogOutIcon } from '../icons/LogOutIcon';

// أيقونات جديدة للقائمة
const MenuIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" x2="20" y1="12" y2="12" />
        <line x1="4" x2="20" y1="6" y2="6" />
        <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
);

const XIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);

export function DashboardLayout({ children, navigate, onLogout, currentPage }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const NavLink = ({ page, icon, label }) => {
        const isActive = currentPage === page;
        const activeClasses = 'bg-indigo-100 text-indigo-600';
        const inactiveClasses = 'text-slate-600 hover:bg-slate-100 hover:text-slate-900';
        
        return (
            <button 
                onClick={() => {
                    navigate(page);
                    setSidebarOpen(false); // أغلق القائمة عند التنقل
                }} 
                className={`flex items-center w-full px-3 py-2 text-md font-medium rounded-md transition-colors ${isActive ? activeClasses : inactiveClasses}`}
            >
                {React.cloneElement(icon, { className: "w-5 h-5" })}
                <span className="mr-3">{label}</span>
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans" dir="rtl">
            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden" 
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 right-0 w-64 bg-white border-l border-slate-200 flex flex-col transform transition-transform z-50 ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0`}>
                <div className="flex items-center h-16 px-6 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                        <img src="/images/EEExplore.jpeg" alt="EEExplore" className="w-7 h-7 rounded-md object-cover" />
                        <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>
                    </div>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    <NavLink page="dashboard" icon={<HomeIcon />} label="نظرة عامة" />
                    <NavLink page="addContestant" icon={<PlusCircleIcon />} label="إضافة متسابق" />
                    <NavLink page="results" icon={<BarChartIcon />} label="النتائج" />
                </nav>
                <div className="p-4 border-t border-slate-200">
                    <button onClick={onLogout} className="flex items-center w-full px-3 py-2 text-md font-medium text-slate-600 rounded-md hover:bg-slate-100">
                        <LogOutIcon className="w-5 h-5" />
                        <span className="mr-3">تسجيل الخروج</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:mr-64">
                {/* Header for mobile */}
                <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-slate-200 lg:hidden">
                    <div className="flex items-center gap-2">
                        <img src="/images/EEExplore.jpeg" alt="EEExplore" className="w-6 h-6 rounded-md object-cover" />
                        <h1 className="text-xl font-bold text-slate-800">لوحة التحكم</h1>
                    </div>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md text-slate-600 hover:bg-slate-100">
                        {isSidebarOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
                    </button>
                </header>

                <main className="p-6 md:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
