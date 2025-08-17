// src/components/ui/EnhancedTable.jsx
import React, { useMemo, useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

// Simple SVG icons for sorting
const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 text-slate-400"><path d="M8 3v18M16 3v18M4 9h16M4 15h16"/></svg>
);
const SortUpIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1"><path d="M12 5l-7 7h14z"/></svg>
);
const SortDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1"><path d="M12 19l7-7H5z"/></svg>
);

export function EnhancedTable({ data, columns, pageSizeOptions = [10, 20, 30, 40, 50], getRowClassName, renderPageLabel, enableExport = true, exportFileName, exportTransform }) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: pageSizeOptions[0] || 10 });

  // Debounce the global filter to avoid re-render on each keystroke
  useEffect(() => {
    const id = setTimeout(() => setGlobalFilter(inputValue), 200);
    return () => clearTimeout(id);
  }, [inputValue]);

  const memoData = useMemo(() => data ?? [], [data]);
  const memoColumns = useMemo(() => columns ?? [], [columns]);

  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    state: { globalFilter, sorting, pagination },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;

  // Export: build a flat array of objects using column headers as keys
  const doExport = () => {
    try {
      const rows = table.getPrePaginationRowModel().rows; // filtered + sorted, not paginated
      const allCols = table.getAllLeafColumns();
      const exportableCols = allCols.filter(col => {
        const def = col.columnDef || {};
        const id = col.id || def.id;
        if (def.enableExport === false) return false;
        if (def.meta && def.meta.export === false) return false;
        if (id === 'actions') return false;
        return true;
      });

      const headerFor = (col) => {
        const h = col.columnDef?.header;
        if (typeof h === 'string') return h;
        return col.columnDef?.accessorKey || col.id || '';
      };

      const dataRows = rows.map(r => {
        if (typeof exportTransform === 'function') return exportTransform(r.original, exportableCols);
        const obj = {};
        exportableCols.forEach(col => {
          const key = headerFor(col);
          // Prefer accessorKey when available; fallback to column id
          let val;
          if (col.columnDef?.accessorKey) {
            val = r.getValue(col.columnDef.accessorKey);
          } else {
            // Try id-based access
            try { val = r.getValue(col.id); } catch { val = r.original[col.id]; }
          }
          if (val === undefined || val === null) val = '';
          if (typeof val === 'object') {
            // Best-effort stringify complex values
            try { val = JSON.stringify(val); } catch { val = String(val); }
          }
          obj[key] = val;
        });
        return obj;
      });

      const ws = XLSX.utils.json_to_sheet(dataRows);
      // Keep column order as in table
      const headers = exportableCols.map(headerFor);
      ws['!cols'] = headers.map(() => ({ wch: 16 }));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'الجدول');
      const name = exportFileName || `تصدير-الجدول-${new Date().toISOString().slice(0,10)}.xlsx`;
      XLSX.writeFile(wb, name);
    } catch (e) {
      console.error('Export failed', e);
      alert('تعذر تصدير الجدول.');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs md:text-sm rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 ring-1 ring-slate-100 shadow-sm focus:border-blue-300 focus:ring-2 focus:ring-blue-400 focus:outline-none placeholder:text-slate-400"
            placeholder="ابحث في جميع الأعمدة..."
          />
        </div>
        {enableExport && (
          <button
            type="button"
            onClick={doExport}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm px-3 py-2 shadow-sm"
            title="تصدير إكسل"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>تصدير إكسل</span>
          </button>
        )}
      </div>
      <div className="overflow-auto rounded-2xl border border-blue-100 bg-white/90 backdrop-blur-sm shadow-sm">
        <table className="w-full text-xs md:text-sm text-right text-slate-700">
          <thead className="sticky top-0 z-10">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} scope="col" className="px-3 md:px-4 py-2 font-semibold text-[11px] md:text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-slate-700">
                    {header.isPlaceholder ? null : (
                      <div
                        className="flex items-center justify-end gap-1 cursor-pointer select-none hover:text-slate-900"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                          asc: <SortUpIcon />,
                          desc: <SortDownIcon />,
                        }[header.column.getIsSorted()] ?? <SortIcon />}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={memoColumns.length} className="px-4 py-6 text-center text-slate-400">
                  لا توجد سجلات مطابقة
                </td>
              </tr>
            ) : (
              rows.map(row => (
                <tr key={row.id} className={getRowClassName ? getRowClassName(row.original) : "odd:bg-white even:bg-slate-50 hover:bg-blue-50 transition-colors"}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-3 md:px-4 py-2 align-middle whitespace-normal break-words">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
        <div className="flex items-center gap-1 p-1 rounded-full bg-slate-100">
          <button
            aria-label="الصفحة الأولى"
            className="px-2 py-1 rounded-full text-slate-700 hover:bg-white hover:shadow-sm ring-1 ring-transparent hover:ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 20L9 12l10-8"/><path d="M5 19V5"/></svg>
          </button>
          <button
            aria-label="السابق"
            className="px-2 py-1 rounded-full text-slate-700 hover:bg-white hover:shadow-sm ring-1 ring-transparent hover:ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button
            aria-label="التالي"
            className="px-2 py-1 rounded-full text-slate-700 hover:bg-white hover:shadow-sm ring-1 ring-transparent hover:ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <button
            aria-label="الصفحة الأخيرة"
            className="px-2 py-1 rounded-full text-slate-700 hover:bg-white hover:shadow-sm ring-1 ring-transparent hover:ring-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 4l10 8-10 8"/><path d="M19 5v14"/></svg>
          </button>
        </div>
        <span dir="rtl" className="flex items-center gap-1 text-xs bg-white/70 px-2 py-1 rounded-md ring-1 ring-slate-200 text-right">
          {typeof renderPageLabel === 'function'
            ? renderPageLabel(table.getState().pagination.pageIndex + 1, table.getPageCount())
            : (
                <>
                  <div>صفحة</div>
                  <strong>
                    <bdi>{table.getState().pagination.pageIndex + 1}</bdi>
                    <span className="mx-0.5">من</span>
                    <bdi>{table.getPageCount()}</bdi>
                  </strong>
                </>
              )}
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          className="p-1.5 border border-slate-200 rounded-md bg-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {pageSizeOptions.map(pageSize => (
            <option key={pageSize} value={pageSize}>
              إظهار {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}