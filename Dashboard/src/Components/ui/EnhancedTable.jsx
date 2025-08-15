// src/components/ui/EnhancedTable.jsx
import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

// Simple SVG icons for sorting
const SortIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1 text-slate-400"><path d="M8 3v18M16 3v18M4 9h16M4 15h16"/></svg>;
const SortUpIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1"><path d="M12 5l-7 7h14z"/></svg>;
const SortDownIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block ml-1"><path d="M12 19l7-7H5z"/></svg>;

export function EnhancedTable({ data, columns }) {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, // initial page index
    pageSize: 10, // default page size
  });

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="space-y-4">
      <input
        value={globalFilter ?? ''}
        onChange={e => setGlobalFilter(e.target.value)}
        className="w-full p-2 text-md border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        placeholder="ابحث في جميع الأعمدة..."
      />
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-md text-right text-slate-500">
          <thead className="text-sm text-slate-700 uppercase bg-slate-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} scope="col" className="px-6 py-3">
                    <div
                      className="flex items-center justify-end cursor-pointer select-none"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: <SortUpIcon />,
                        desc: <SortDownIcon />,
                      }[header.column.getIsSorted()] ?? <SortIcon />}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="bg-white border-b border-slate-200 hover:bg-slate-50">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-6 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between gap-2 pt-2 flex-wrap">
        <div className="flex items-center gap-2">
            <button
                className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
            >
                {'<<'}
            </button>
            <button
                className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                {'<'}
            </button>
            <button
                className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                {'>'}
            </button>
            <button
                className="p-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
            >
                {'>>'}
            </button>
        </div>
        <span className="flex items-center gap-1 text-sm">
          <div>صفحة</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} من {table.getPageCount()}
          </strong>
        </span>
        <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
                table.setPageSize(Number(e.target.value))
            }}
            className="p-2 border rounded-md bg-white"
        >
            {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                    إظهار {pageSize}
                </option>
            ))}
        </select>
      </div>
    </div>
  );
}