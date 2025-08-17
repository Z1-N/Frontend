// src/pages/PublicLeaderboardPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '../Components/ui/Button';
import { getContestants } from '../services/api';
import { AwardDisplay } from '../Components/ui/AwardDisplay';
import { StarIcon } from '../Components/icons/StarIcon';
import { AwardIcon } from '../Components/icons/AwardIcon';

export function PublicLeaderboardPage({ onAdminLogin }) {
  // Lightweight, responsive public-only table
  const ZenTable = ({ rows = [], pageSize = 10 }) => {
    const [page, setPage] = useState(0);
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
    const start = page * pageSize;
    const pageRows = rows.slice(start, start + pageSize);

    const prev = () => setPage(p => Math.max(0, p - 1));
    const next = () => setPage(p => Math.min(totalPages - 1, p + 1));

    return (
      <div className="space-y-4">
        {/* Mobile: stacked cards */}
    <div className="grid sm:hidden gap-2">
          {pageRows.map((r) => (
      <div key={r.name} className="rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 p-3">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold text-slate-800 ${r.rank === 1 ? 'bg-yellow-400' : r.rank === 2 ? 'bg-blue-300' : r.rank === 3 ? 'bg-amber-500' : 'bg-slate-200'}`}>#{r.rank}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-transparent text-blue-200 px-2.5 py-0.5 ring-1 ring-blue-300/40">{r.description || '—'}</span>
              </div>
              <div className="mt-2">
                <div className="font-extrabold text-slate-100 text-sm leading-tight break-words">{r.name}</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-[11px] text-slate-300">النقاط</div>
                  <div className="text-base font-black text-yellow-400">{r.points}</div>
                </div>
                {/* Small screens: show awards label below points */}
                <div className="mt-1 text-[11px] text-slate-300">الاوسمة</div>
              </div>
              <div className="mt-2 flex flex-wrap gap-2 justify-end">
                <AwardDisplay icon={<StarIcon />} count={r.starOfCreativity} title="نجمة الإبداع" colorClass="text-red-400" />
                <AwardDisplay icon={<StarIcon />} count={r.starOfParticipation} title="نجمة المشاركة" colorClass="text-yellow-400" />
                <AwardDisplay icon={<AwardIcon />} count={r.medalOfCreativity} title="وسام الإبداع" colorClass="text-red-400" />
                <AwardDisplay icon={<AwardIcon />} count={r.medalOfParticipation} title="وسام المشاركة" colorClass="text-yellow-500" />
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="text-center py-10 text-slate-300">لا توجد بيانات</div>
          )}
        </div>

        {/* Desktop: minimal table */}
        <div className="hidden sm:block overflow-x-auto rounded-lg border border-white/20 bg-white/5 backdrop-blur-lg">
          <table className="min-w-full text-sm text-right text-slate-700">
            <thead className="sticky top-0 z-10 bg-white/5 backdrop-blur-sm">
              <tr>
                <th className="px-3 py-2 font-semibold text-[11px] text-slate-100/90">#</th>
                <th className="px-3 py-2 font-semibold text-[11px] text-slate-100/90">الاسم</th>
                <th className="px-3 py-2 font-semibold text-[11px] text-slate-100/90">الدفعة</th>
                <th className="px-3 py-2 font-semibold text-[11px] text-slate-100/90">النقاط</th>
                <th className="px-3 py-2 font-semibold text-[11px] text-slate-100/90">الأوسمة</th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((r) => (
                <tr key={r.name} className="odd:bg-white/0 even:bg-white/[0.02] hover:bg-white/[0.06] transition-colors">
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-slate-800 ${r.rank === 1 ? 'bg-yellow-400' : r.rank === 2 ? 'bg-blue-300' : r.rank === 3 ? 'bg-amber-500' : 'bg-slate-200'}`}>{r.rank}</span>
                  </td>
                  <td className="px-3 py-2">
                    <div className="font-semibold text-slate-100 leading-tight break-words">{r.name}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 rounded-full bg-transparent text-blue-200 px-2 py-0.5 ring-1 ring-blue-300/40">{r.description || '—'}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap font-bold text-yellow-400">{r.points}</td>
                  <td className="px-3 py-2">
                    <div className="flex flex-wrap gap-2 justify-end">
                      <AwardDisplay icon={<StarIcon />} count={r.starOfCreativity} title="نجمة الإبداع" colorClass="text-red-400" />
                      <AwardDisplay icon={<StarIcon />} count={r.starOfParticipation} title="نجمة المشاركة" colorClass="text-yellow-400" />
                      <AwardDisplay icon={<AwardIcon />} count={r.medalOfCreativity} title="وسام الإبداع" colorClass="text-red-400" />
                      <AwardDisplay icon={<AwardIcon />} count={r.medalOfParticipation} title="وسام المشاركة" colorClass="text-yellow-500" />
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-10 text-center text-slate-300">لا توجد بيانات</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
          <div className="flex items-center gap-1 p-1 rounded-full bg-white/10 backdrop-blur-sm">
            <button
              aria-label="السابق"
              className="px-2 py-1 rounded-full text-slate-200 hover:bg-white/10 hover:shadow-sm ring-1 ring-transparent hover:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={prev}
              disabled={page === 0}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              aria-label="التالي"
              className="px-2 py-1 rounded-full text-slate-200 hover:bg-white/10 hover:shadow-sm ring-1 ring-transparent hover:ring-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={next}
              disabled={page >= totalPages - 1}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
          <span dir="rtl" className="flex items-center gap-1 text-xs text-slate-200 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md ring-1 ring-white/15 text-right">
            <span>صفحة</span>
            <strong>
              <bdi>{page + 1}</bdi>
              <span className="mx-0.5">من</span>
              <bdi>{totalPages}</bdi>
            </strong>
          </span>
        </div>
      </div>
    );
  };
  const [contestants, setContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await getContestants();
        setContestants(res?.data || []);
      } catch (e) {
        setError('تعذر تحميل لوحة الصدارة');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const data = useMemo(() => {
    const sorted = [...(contestants || [])].sort((a, b) => (b.totalOfStars ?? 0) - (a.totalOfStars ?? 0));
    const countAwards = (accolades = [], type) => accolades.filter(a => (typeof a === 'string' ? a === type : a?.name === type)).length;
    return sorted.map((c, idx) => ({
      rank: idx + 1,
      name: c.name,
      description: c.description,
      points: c.totalOfStars ?? 0,
      starOfCreativity: countAwards(c.accolade, 'starOfCreativity'),
      starOfParticipation: countAwards(c.accolade, 'starOfParticipation'),
      medalOfCreativity: countAwards(c.accolade, 'medalOfCreativity'),
      medalOfParticipation: countAwards(c.accolade, 'medalOfParticipation'),
    }));
  }, [contestants]);

  const columns = useMemo(() => [
    {
      accessorKey: 'rank',
      header: '#',
      cell: ({ getValue }) => {
        const r = getValue();
        const color = r === 1 ? 'bg-yellow-400' : r === 2 ? 'bg-blue-300' : r === 3 ? 'bg-amber-500' : 'bg-slate-200';
        return <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-slate-800 ${color}`}>{r}</span>;
      },
    },
    { accessorKey: 'name', header: 'الاسم' },
    { accessorKey: 'description', header: 'الدفعة' },
    {
      accessorKey: 'points',
      header: 'النقاط',
      cell: ({ getValue }) => <span className="font-bold text-yellow-600">{getValue()}</span>,
    },
    {
      id: 'awards',
      header: 'الأوسمة',
      cell: ({ row }) => {
        const r = row.original;
        return (
          <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
            <AwardDisplay icon={<StarIcon />} count={r.starOfCreativity} title="نجمة الإبداع" colorClass="text-red-400" />
            <AwardDisplay icon={<StarIcon />} count={r.starOfParticipation} title="نجمة المشاركة" colorClass="text-yellow-400" />
            <AwardDisplay icon={<AwardIcon />} count={r.medalOfCreativity} title="وسام الإبداع" colorClass="text-red-400" />
            <AwardDisplay icon={<AwardIcon />} count={r.medalOfParticipation} title="وسام المشاركة" colorClass="text-yellow-500" />
          </div>
        );
      },
      enableSorting: false,
    },
  ], []);

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(135deg, rgba(8,47,73,0.96), rgba(30,58,138,0.96)), url('/images/ee-pattern.svg')",
        backgroundSize: 'cover, 96px 96px',
        backgroundAttachment: 'fixed',
        backgroundPosition: 'center, top left',
      }}
    >
      <div className="max-w-6xl mx-auto py-8 px-4 md:px-8">
      <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4">
                <Button
          onClick={onAdminLogin}
          className="bg-amber-300 hover:bg-amber-200 text-slate-900 ring-1 ring-amber-200/60 shadow-sm px-3 py-1.5 text-xs md:px-4 md:py-2 md:text-sm rounded-lg"
        >
          دخول المشرف
        </Button>
        <div className="text-right">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">لوحة الصدارة</h1>
        </div>

      </div>

    <div className="rounded-lg bg-white/5 backdrop-blur-lg border border-white/20 p-3 md:p-4">
        {loading ? (
      <div className="text-center py-8 text-slate-100">جاري التحميل...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
          <ZenTable rows={data} pageSize={10} />
        )}
      </div>
      </div>
  </div>
  );
}

export default PublicLeaderboardPage;
