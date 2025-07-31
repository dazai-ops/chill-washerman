'use client'

import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table'
import { useState } from 'react'

import { Button, Table, TextField } from '@radix-ui/themes'

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  renderAction?: (row: TData) => React.ReactNode
  renderToolbar?: React.ReactNode
}

export function DataTable<TData, TValue>({ columns, data, renderAction, renderToolbar }: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const extendedColumns = [...columns]

  if(renderAction) {
    extendedColumns.push({
      id: 'action',
      header: 'Aksi',
      cell: (row) => renderAction(row.row.original),
    })
  }
  const table = useReactTable({
    data,
    columns: extendedColumns,
    state: {
      globalFilter,
      pagination: {
        pageIndex,
        pageSize: 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize: 5 })
        setPageIndex(newState.pageIndex)
      } else {
        setPageIndex(updater.pageIndex)
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, columnId, filterValue) =>
      String(row.getValue(columnId)).toLowerCase().includes(filterValue.toLowerCase()),
  })

  return (
    <div className='w-full'>
      <div className='flex gap-2'>
        <TextField.Root
          size="3"
          placeholder="Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className='w-full mb-4'
        />
        {renderToolbar && renderToolbar}
      </div>

      <Table.Root variant='surface' className='w-full'>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.ColumnHeaderCell key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </Table.ColumnHeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <div className="flex items-center justify-between mt-2">
        <Button
          variant="surface"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Prev
        </Button>
        <div className="text-sm">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <Button
          variant="surface"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
