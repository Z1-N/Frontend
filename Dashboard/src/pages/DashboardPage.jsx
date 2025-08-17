// src/pages/DashboardPage.jsx
import React, { useMemo, useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../Components/ui/Card';
import { Button } from '../Components/ui/Button';
import { AwardDisplay } from '../Components/ui/AwardDisplay';
import { StarIcon } from '../Components/icons/StarIcon';
import { AwardIcon } from '../Components/icons/AwardIcon';
import { EnhancedTable } from '../Components/ui/EnhancedTable';

export function DashboardPage({ contestants, navigate }) {
    // Toggle state: 'grid' or 'table'
    const [viewMode, setViewMode] = useState('grid');
    const [query, setQuery] = useState('');
    const [sortKey, setSortKey] = useState('points_desc');

    // Safe awards counter (supports string or object with name)
    const countAwards = (accolades = [], type) =>
        accolades.filter(a => (typeof a === 'string' ? a === type : a?.name === type)).length;

    const totalAwards = (accolades = []) =>
        accolades.reduce((sum, a) => sum + (a ? 1 : 0), 0);

    // استخراج الأحرف الأولى من الاسم لعرضها كصورة رمزية بسيطة
    const getInitials = (name = '') =>
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(part => part[0])
            .join('') || '•';

    // Filter + sort for grid view
    const gridItems = useMemo(() => {
        const list = (contestants || []).filter(c => {
            if (!query) return true;
            const q = query.toLowerCase();
            return (
                (c.name || '').toLowerCase().includes(q) ||
                (c.description || '').toLowerCase().includes(q)
            );
        });
        const by = sortKey;
        const compare = (a, b) => {
            switch (by) {
                case 'points_asc':
                    return (a.totalOfStars ?? 0) - (b.totalOfStars ?? 0);
                case 'points_desc':
                    return (b.totalOfStars ?? 0) - (a.totalOfStars ?? 0);
                case 'name_asc':
                    return (a.name || '').localeCompare(b.name || '');
                case 'name_desc':
                    return (b.name || '').localeCompare(a.name || '');
                case 'awards_desc':
                    return totalAwards(b.accolade) - totalAwards(a.accolade);
                case 'awards_asc':
                    return totalAwards(a.accolade) - totalAwards(b.accolade);
                default:
                    return 0;
            }
        };
        return list.sort(compare);
    }, [contestants, query, sortKey]);

    const tableColumns = useMemo(() => [
        { accessorKey: 'name', header: 'الاسم' },
        { accessorKey: 'description', header: 'الدفعة' },
        {
            accessorKey: 'totalOfStars',
            header: 'النقاط',
            cell: ({ getValue }) => <span className="font-bold text-indigo-600">{getValue()}</span>,
        },
        {
            accessorKey: 'starOfCreativity',
            header: 'نجمة الإبداع',
        },
        {
            accessorKey: 'starOfParticipation',
            header: 'نجمة المشاركة',
        },
        {
            accessorKey: 'medalOfCreativity',
            header: 'وسام الإبداع',
        },
        {
            accessorKey: 'medalOfParticipation',
            header: 'وسام المشاركة',
        },
        {
            id: 'actions',
            header: 'الإجراءات',
            cell: ({ row }) => (
                <div className="flex justify-end whitespace-nowrap">
                    <Button
                        className="px-3 py-1.5 text-xs rounded-full bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50 hover:shadow-sm transition"
                        onClick={() => navigate('contestantDetails', { id: row.original.id })}
                    >
                        عرض
                    </Button>
                </div>
            ),
            enableSorting: false,
        },
    ], [navigate]);

    const tableData = useMemo(() =>
        (contestants || []).map(c => ({
            id: c.id,
            name: c.name,
            description: c.description,
            totalOfStars: c.totalOfStars ?? 0,
            starOfCreativity: countAwards(c.accolade, 'starOfCreativity'),
            starOfParticipation: countAwards(c.accolade, 'starOfParticipation'),
            medalOfCreativity: countAwards(c.accolade, 'medalOfCreativity'),
            medalOfParticipation: countAwards(c.accolade, 'medalOfParticipation'),
        })),
    [contestants]);

    return (
        <div className="max-w-7xl mx-auto py-6 px-4 md:px-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between mb-4">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">المشاركون في البرنامج</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="inline-flex rounded-xl bg-slate-200 p-1 self-start">
                        <button
                            className={`px-3 py-1.5 text-sm rounded-lg transition ${viewMode === 'grid' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                            onClick={() => setViewMode('grid')}
                        >
                            عرض كبطاقات
                        </button>
                        <button
                            className={`px-3 py-1.5 text-sm rounded-lg transition ${viewMode === 'table' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
                            onClick={() => setViewMode('table')}
                        >
                            عرض كجدول
                        </button>
                    </div>
                    {viewMode === 'grid' && (
                        <>
                            <input
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                placeholder="ابحث بالاسم أو الدفعة..."
                                className="flex-1 sm:w-64 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <select
                                value={sortKey}
                                onChange={e => setSortKey(e.target.value)}
                                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="points_desc">ترتيب: النقاط (تنازلي)</option>
                                <option value="points_asc">ترتيب: النقاط (تصاعدي)</option>
                                <option value="name_asc">الاسم (أ-ي)</option>
                                <option value="name_desc">الاسم (ي-أ)</option>
                                <option value="awards_desc">الأوسمة (أعلى)</option>
                                <option value="awards_asc">الأوسمة (أقل)</option>
                            </select>
                        </>
                    )}
                </div>
            </div>

            {viewMode === 'table' ? (
                <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-md p-4">
                    <EnhancedTable data={tableData} columns={tableColumns} enableExport={true} exportFileName={`المشاركون-${new Date().toISOString().slice(0,10)}.xlsx`} />
                </div>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {gridItems.map(c => (
                    <div
                        key={c.id}
                        className="group relative rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-[1px] transition-all duration-300 hover:from-indigo-500/30 hover:via-purple-500/30 hover:to-pink-500/30 hover:-translate-y-1 hover:shadow-xl"
                    >
                        <Card className="p-0 rounded-3xl bg-white/80 backdrop-blur-sm shadow-md flex flex-col justify-between">
                            <CardHeader className="p-4 pb-1">
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-base font-bold shadow-sm">
                                                {getInitials(c.name)}
                                            </div>
                                            <span className="pointer-events-none absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-indigo-500/0 to-purple-600/0 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg md:text-xl font-extrabold text-slate-900 leading-tight break-words">{c.name}</CardTitle>
                                            <CardDescription className="text-xs md:text-sm text-slate-500 break-words">{c.description || '—'}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap self-end md:self-auto">
                                        {/* Match colors with ContestantDetailsPage */}
                                        <AwardDisplay icon={<StarIcon />} count={countAwards(c.accolade, 'starOfCreativity')} title="نجمة الإبداع" colorClass="text-red-400" />
                                        <AwardDisplay icon={<StarIcon />} count={countAwards(c.accolade, 'starOfParticipation')} title="نجمة المشاركة" colorClass="text-yellow-400" />
                                        <AwardDisplay icon={<AwardIcon />} count={countAwards(c.accolade, 'medalOfCreativity')} title="وسام الإبداع" colorClass="text-red-400" />
                                        <AwardDisplay icon={<AwardIcon />} count={countAwards(c.accolade, 'medalOfParticipation')} title="وسام المشاركة" colorClass="text-yellow-500" />
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="pt-3 pb-4">
                                <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-gradient-to-b from-slate-50 to-white p-4 text-center">
                                    <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-indigo-100 blur-2xl group-hover:bg-indigo-200 transition-colors" />
                                    <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-purple-100 blur-2xl group-hover:bg-purple-200 transition-colors" />
                                    <p className="relative z-10 text-3xl sm:text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                                        {c.totalOfStars}
                                    </p>
                                    <p className="relative z-10 mt-1 text-[11px] md:text-sm font-medium text-slate-500">نقطة</p>
                                </div>
                            </CardContent>

                            <CardFooter className="p-4 pt-0">
                                <Button
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-sm md:text-base py-2.5 rounded-2xl font-semibold shadow-md transition"
                                    onClick={() => navigate('contestantDetails', { id: c.id })}
                                >
                                    عرض التفاصيل
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                ))}
            </div>
            )}
        </div>
    );
}
