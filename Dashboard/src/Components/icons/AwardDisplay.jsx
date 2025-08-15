export const AwardDisplay = ({ icon, count, title, colorClass }) => {
    if (count === 0) return null;
    return (
        <div className="relative flex items-center" title={title}>
            {React.cloneElement(icon, { className: `w-5 h-5 ${colorClass}` })}
            {count > 1 && (
                <span className="absolute -top-2 -right-2 flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-slate-700 rounded-full">
                    {count}
                </span>
            )}
        </div>
    );
};

