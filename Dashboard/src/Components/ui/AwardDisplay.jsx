// src/components/ui/AwardDisplay.jsx
import React from 'react';

export const AwardDisplay = ({ icon, count, title, colorClass }) => {
    // لا تعرض أي شيء إذا كان العدد صفرًا
    if (count === 0) {
        return null;
    }

    return (
        <div className="relative flex items-center" title={title}>
            {/* استنساخ الأيقونة مع إضافة الـ classes اللازمة */}
            {React.cloneElement(icon, { className: `w-6 h-6 ${colorClass}` })}
            
            {/* عرض العدد فقط إذا كان أكبر من 1 */}
            {count > 1 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-slate-700 rounded-full">
                    {count}
                </span>
            )}
        </div>
    );
};