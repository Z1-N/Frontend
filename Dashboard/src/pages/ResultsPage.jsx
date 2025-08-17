// src/Pages/ResultsPage.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { EnhancedTable } from '../Components/ui/EnhancedTable';
import { Card } from '../Components/ui/Card';
import { Input } from '../Components/ui/Input';
import { Label } from '../Components/ui/Label';
import { format, parseISO, isWithinInterval, isValid } from 'date-fns';
import { getContestantDetails } from '../services/api'; // 🔽 استيراد دالة جلب التفاصيل

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

  const columns = useMemo(() => [
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
      cell: info => <span className="font-bold text-green-600">+{info.getValue()}</span>,
    },
    {
      accessorKey: 'reason',
      header: 'السبب',
    },
    {
      accessorKey: 'date',
      header: 'التاريخ',
      cell: info => {
        const date = parseISO(info.getValue());
        return isValid(date) ? format(date, 'yyyy/MM/dd') : 'تاريخ غير صالح';
      },
    },
  ], []);

  const filteredData = useMemo(() => {
    // 🔽 استخدام البيانات التفصيلية الجديدة
    let allPoints = (detailedContestants || []).flatMap(c => 
      (c.startResponse || []).map(p => ({
        contestantName: c.name,
        contestantBatch: c.description,
        points: p.number,
        reason: p.reason,
        date: p.dateTime
      }))
    );

    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      if (isValid(start) && isValid(end)) {
        allPoints = allPoints.filter(p => {
          const pointDate = parseISO(p.date);
          return isValid(pointDate) && isWithinInterval(pointDate, { start, end });
        });
      }
    }
    
    return allPoints;
  }, [detailedContestants, startDate, endDate]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold text-slate-900">سجل النتائج والنقاط</h2>
        <p className="mt-2 text-lg text-slate-600">
          هنا يمكنك البحث، الفلترة، وترتيب جميع النقاط الممنوحة.
        </p>
      </div>

      <Card>
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold">فلترة حسب التاريخ</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <Label htmlFor="startDate">من تاريخ</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate">إلى تاريخ</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </Card>
      
      {isLoading ? (
        <div className="text-center py-8">جاري تحميل سجل النقاط...</div>
      ) : (
        <EnhancedTable data={filteredData} columns={columns} />
      )}
    </div>
  );
}
