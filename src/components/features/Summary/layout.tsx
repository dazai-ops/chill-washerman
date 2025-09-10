"use client"

//lib
import { useState } from 'react'
import { useEffect } from 'react'
import { toast } from 'sonner'
import { CalendarIcon } from '@radix-ui/react-icons';
import { DatePicker } from '@/components/ui/DatePicker/DatePicker';
import { Spinner, Flex, Button, Text, Badge } from '@radix-ui/themes'

//components
import { ChartBarInteractive } from '@/components/layout/BarChart/BarChart'
import { DataTable } from '@/components/layout/DataTable/DataTable';
import Tabnav from '@/components/layout/TabNav/TabNav'

//redux
import { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getTransaction, getTransactionForChart } from '@/lib/thunk/transaction/transactionThunk'

//utils
import { transactionTableColumns } from '@/features/transaction/columns'
import { Transaction } from '@/models/transaction.model'
import ExportCSVButton from '../../ui/CSV/CsvButton';

interface SummaryDataProps {
  completed: Array<Transaction>
  incomplete: Array<Transaction>
}

function HistoryLayout() {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const dispatch = useDispatch<AppDispatch>()
  const columns = transactionTableColumns
  const transactionChartData = useSelector((state: RootState) => state.transaksi.chartTransaction)
  const transactionTableData = useSelector((state: RootState) => state.transaksi.transactionList)
  const loading = useSelector((state: RootState) => state.transaksi.loading)
 
  useEffect(() => {
    dispatch(getTransactionForChart())
    dispatch(getTransaction())
  },[dispatch])
  
  useEffect(() => {
    if(startDate && endDate){
      if(new Date(endDate) < new Date(startDate)){
        toast.error('Tanggal Invalid', {
          position: "top-center",
          description: 'Tanggal akhir harus lebih besar dari tanggal mulai',
          style: {
            width: '400px'
          }
        })
      } else {
        dispatch(getTransaction({start_date: startDate, end_date: endDate}))
        dispatch(getTransactionForChart({start_date: startDate, end_date: endDate}))
      }
    }
  },[startDate, endDate, dispatch])

  const result = transactionTableData.reduce<SummaryDataProps>(
    (acc, curr) => {
      if(curr!.status_proses === "selesai"){
        acc.completed.push(curr!)
      } else {
        acc.incomplete.push(curr!)
      }
      return acc
    }, {
      completed: [], incomplete: []
    }
  )

  const handleFilterDate = (range: string) => {
    if(range === 'all'){
      dispatch(getTransaction())
      dispatch(getTransactionForChart())
    }
    if(range === 'today'){
      const today = new Date()
      console.log("clg",today)
      setStartDate(today)
      setEndDate(today)
    }
    if(range === 'week'){
      const today = new Date()
      setStartDate(new Date(today.setDate(today.getDate() - 7)))
      setEndDate(new Date())
    }
    if(range === 'month'){
      const today = new Date()
      setStartDate(new Date(today.getFullYear(), today.getMonth(), 1))
      setEndDate(new Date(today.getFullYear(), today.getMonth() + 1, 0))
    }
    if(range === 'last_month'){
      const today = new Date()
      setStartDate(new Date(today.getFullYear(), today.getMonth() - 1, 1))
      setEndDate(new Date(today.getFullYear(), today.getMonth(), 0))
    }
  }

  return (
    <div className='w-full flex flex-col items-center'>
      <Tabnav />
      <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[1300px] mt-10 flex justify-between">
        {loading ? (
          <Spinner/>
        ) : (
          <>
            <Flex justify="start" align="center" className='mb-2'>
              <ExportCSVButton data={transactionTableData}/>
            </Flex>
            <Flex justify="end" align="center" className='mb-2 gap-2'>
              <Button color='gray' size="2" onClick={() => handleFilterDate('all')}>
                <CalendarIcon/>
                Semua
              </Button>
              <Button color='gray' size="2" onClick={() => handleFilterDate('today')}>
                <CalendarIcon/>
                Hari ini
              </Button>
              <Button color='gray' size="2" onClick={() => handleFilterDate('week')}>
                <CalendarIcon/>
                Minggu ini
              </Button>
              <Button color='gray' size="2" onClick={() => handleFilterDate('month')}>
                <CalendarIcon/>
                Bulan ini
              </Button>
              <Button color='gray' size="2" onClick={() => handleFilterDate('last_month')}>
                <CalendarIcon/>
                Bulan lalu
              </Button>
              <DatePicker label='Tanggal mulai' onDateChange={(date) => setStartDate(date)}/>
              <DatePicker label='Tanggal akhir' onDateChange={(date) => setEndDate(date)}/>
            </Flex>
          </>
        )}
      </div>
      {loading ? (
        <Spinner className='mt-8 mb-4'/>  
      ): (  
        <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[1300px]">
          <ChartBarInteractive data={transactionChartData ?? []}/>
          <Flex gap="2" className='mt-3' justify="between" align="start">
            <Flex justify="center" align="center" direction="column" gap="1" className='w-1/2'>
              <Text className='font-bold text-end mb-1'>
                <Badge size="2" color='green'>Selesai</Badge>
              </Text>
              <DataTable columns={columns} data={result.completed ?? []}/>
            </Flex>
            <Flex justify="center" align="center" direction="column" gap="1" className='w-1/2'>
              <Text className='font-bold text-end'>
                <Badge size="2" color='yellow'>
                  Belum Selesai
                </Badge>
              </Text>
              <DataTable columns={columns} data={result.incomplete ?? []}/>
            </Flex>
          </Flex>
        </div>
      )}
    </div>
  )
}

export default HistoryLayout
