import { HomeIcon } from '../icons/HomeIcon';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { BarChartIcon } from '../icons/BarChartIcon';
import { LogOutIcon } from '../icons/LogOutIcon';

export function DashboardLayout({ children, navigate, onLogout }) {
  const NavLink = ({ page, icon, label }) => (
    <button onClick={() => navigate(page)} className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200">
      {icon}
      <span className="ml-3">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans" dir="rtl">
      <aside className="w-64 bg-white border-l border-gray-200">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-2xl font-bold text-slate-800">لوحة التحكم</h1>
        </div>
        <nav className="p-4 space-y-2">
          <NavLink page="dashboard" icon={<HomeIcon className="w-5 h-5" />} label="نظرة عامة" />
          <NavLink page="addContestant" icon={<PlusCircleIcon className="w-5 h-5" />} label="إضافة متسابق" />
          <NavLink page="results" icon={<BarChartIcon className="w-5 h-5" />} label="عرض النتائج" />
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
             <button onClick={onLogout} className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-200">
                <LogOutIcon className="w-5 h-5" />
                <span className="ml-3">تسجيل الخروج</span>
            </button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
