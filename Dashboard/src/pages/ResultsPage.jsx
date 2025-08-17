// src/Pages/ResultsPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { EnhancedTable } from '../Components/ui/EnhancedTable';
import { Card } from '../Components/ui/Card';
import { FancyCard } from '../Components/ui/FancyCard';
import { Input } from '../Components/ui/Input';
import { Label } from '../Components/ui/Label';
import { format, parseISO, isWithinInterval, isValid } from 'date-fns';
import { getContestantDetails } from '../services/api'; // 🔽 استيراد دالة جلب التفاصيل
import { AwardIcon } from '../Components/icons/AwardIcon';
import { PlusCircleIcon } from '../Components/icons/PlusCircleIcon';

export function ResultsPage({ contestants }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  
  // 🔽 حالات جديدة لجلب البيانات التفصيلية
  const [detailedContestants, setDetailedContestants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔽 useEffect لجلب التفاصيل الكاملة لجميع المتسابقين
  useEffect(() => {
    const fetchAllDetails = async () => {
      setIsLoading(true);
      // استخدام Promise.all لتنفيذ جميع طلبات الـ API بالتوازي
      const promises = contestants.map(c => getContestantDetails(c.name));
      const results = await Promise.all(promises);
      
      // استخلاص البيانات من كل استجابة (الـ API يرجع مصفوفة لكل طلب)
      const allDetails = results.map(res => res.data[0]).filter(Boolean);
      setDetailedContestants(allDetails);
      setIsLoading(false);
    };

    if (contestants && contestants.length > 0) {
      fetchAllDetails();
    } else {
        setIsLoading(false);
    }
  }, [contestants]);

  // Helper: parse date safely to timestamp (ms). Returns null if invalid
  const toTs = (d) => {
    if (!d) return null;
    try {
      const parsed = parseISO(d);
      if (isValid(parsed)) return parsed.getTime();
    } catch (_) {}
    const t = new Date(d).getTime();
    return Number.isFinite(t) ? t : null;
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'type',
      header: 'النوع',
      cell: info => {
        const t = info.row.original.type;
        if (t === 'point') {
          return (
            <span className="inline-flex items-center gap-1 text-green-700">
              <PlusCircleIcon className="w-4 h-4" />
              <span>نقاط</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 text-yellow-700">
            <AwardIcon className="w-4 h-4" />
            <span>وسام</span>
          </span>
        );
      }
    },
    {
      accessorKey: 'contestantName',
      header: 'اسم المتسابق',
      cell: info => <span className="font-medium text-slate-900">{info.getValue()}</span>,
    },
    {
      accessorKey: 'contestantBatch',
      header: 'الدفعة',
    },
    {
      accessorKey: 'points',
      header: 'النقاط',
      cell: info => {
        const row = info.row.original;
        if (row.type === 'accolade') return <span className="text-slate-400">—</span>;
        return <span className="font-bold text-green-600">+{info.getValue()}</span>;
      },
    },
    {
      accessorKey: 'reason',
      header: 'السبب',
    },
    {
      accessorKey: 'date',
      header: 'التاريخ',
      cell: info => {
        const v = info.getValue();
        if (!v) return '—';
        let date;
        try { date = parseISO(v); } catch (e) { return '—'; }
        return isValid(date) ? format(date, 'yyyy/MM/dd') : '—';
      },
    },
  ], []);

  const filteredData = useMemo(() => {
    // Build unified events (points + accolades)
    let allEvents = (detailedContestants || []).flatMap(c => {
      const points = (c.startResponse || []).map((p, idx) => ({
        type: 'point',
        contestantName: c.name,
        contestantBatch: c.description,
        points: p.number,
        reason: p.reason,
        date: p.dateTime,
        ts: toTs(p.dateTime),
        key: `p-${c.id || c.name}-${p.id || idx}`,
      }));
      const awards = (c.accolade || []).map((a, idx) => ({
        type: 'accolade',
        contestantName: c.name,
        contestantBatch: c.description,
        points: 0,
        reason: a.reason || '—',
        date: a.dateTime || null,
        ts: toTs(a.dateTime),
        key: `a-${c.id || c.name}-${a.id || idx}`,
      }));
      return [...points, ...awards];
    });

    // Optional date filter (only keep events with valid ts)
    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      if (isValid(start) && isValid(end)) {
        allEvents = allEvents.filter(e => {
          // Keep events without dates visible; otherwise filter by range
          if (e.ts === null) return true;
          return isWithinInterval(new Date(e.ts), { start, end });
        });
      }
    }

    // Sort desc by timestamp; null timestamps at bottom
    allEvents.sort((a, b) => {
      if (a.ts === null && b.ts === null) return 0;
      if (a.ts === null) return 1;
      if (b.ts === null) return -1;
      return b.ts - a.ts;
    });

    return allEvents;
  }, [detailedContestants, startDate, endDate]);

  return (
  <div className="space-y-8 max-w-5xl mx-auto py-6 px-4 md:px-8">
      <div className="text-center">
  <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 tracking-tight break-words">سجل النتائج والنقاط</h2>
  <p className="mt-1 text-xs sm:text-sm text-slate-600">هنا يمكنك البحث، الفلترة، وترتيب جميع النقاط الممنوحة.</p>
      </div>

      <FancyCard>
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-indigo-700 mb-3">فلترة حسب التاريخ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 text-sm">
            <div>
              <Label htmlFor="startDate" className="font-semibold text-slate-700">من تاريخ</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="mt-1 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="font-semibold text-slate-700">إلى تاريخ</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="mt-1 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      </FancyCard>

      {isLoading ? (
        <div className="text-center py-12 text-lg text-slate-500 animate-pulse">جاري تحميل سجل النقاط...</div>
      ) : (
  <div className="rounded-2xl border border-slate-100 bg-white/80 backdrop-blur-sm shadow-md p-4">
          <EnhancedTable
            data={filteredData}
            columns={columns}
            enableExport={true}
            exportFileName={`سجل-النتائج-${new Date().toISOString().slice(0,10)}.xlsx`}
          />
        </div>
      )}
    </div>
  );
}
