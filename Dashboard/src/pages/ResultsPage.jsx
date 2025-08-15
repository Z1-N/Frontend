// src/pages/ResultsPage.jsx
import React, { useState, useMemo } from 'react';
import { EnhancedTable } from '../Components/ui/EnhancedTable';
import { Card } from '../Components/ui/Card';
import { Input } from '../Components/ui/Input';
import { Label } from '../Components/ui/Label';
import { format, parseISO, isWithinInterval } from 'date-fns';

export function ResultsPage({ contestants }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Define columns for the table
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
      cell: info => format(parseISO(info.getValue()), 'yyyy/MM/dd'),
    },
  ], []);

  // Memoize and filter the data
  const filteredData = useMemo(() => {
    let allPoints = contestants.flatMap(c => 
      c.pointsHistory.map(p => ({
        ...p,
        contestantName: c.name,
        contestantBatch: c.batch
      }))
    );

    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      allPoints = allPoints.filter(p => {
        const pointDate = parseISO(p.date);
        return isWithinInterval(pointDate, { start, end });
      });
    }
    
    return allPoints;
  }, [contestants, startDate, endDate]);

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

      <EnhancedTable data={filteredData} columns={columns} />
    </div>
  );
}