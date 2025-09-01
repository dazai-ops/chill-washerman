"use client"

import { useState } from 'react'
import { ChartBarInteractive } from '@/components/layout/BarChart/BarChart'
import { getTransaction, getTransactionForChart } from '@/lib/thunk/transaksi/transaksiThunk'
import { AppDispatch, RootState } from '@/redux/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Tabnav from '@/components/layout/TabNav/TabNav'
import { Spinner, Flex, Button, Text, Badge } from '@radix-ui/themes'
import { DataTable } from '../../layout/DataTable/DataTable';
import { transactionColumns } from '@/features/transaksi/columns'
import { DatePicker } from '../../ui/DatePicker/DatePicker';
import { toast } from 'sonner'
import { CalendarIcon } from '@radix-ui/react-icons';
import { Transaction } from '@/models/transaksitwo.model'

interface Props {
  selesai: Array<Transaction>
  belum_selesai: Array<Transaction>
}

function HistoryLayout() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedDateFinal, setSelectedDateFinal] = useState<Date>();

  const dispatch = useDispatch<AppDispatch>()
  const columns = transactionColumns
  const data = useSelector((state: RootState) => state.transaksi.chartTransaction)
  const transaction = useSelector((state: RootState) => state.transaksi.transactionList)
  const loading = useSelector((state: RootState) => state.transaksi.loading)
 
  useEffect(() => {
    dispatch(getTransactionForChart())
    dispatch(getTransaction())
  },[dispatch])
  
  useEffect(() => {
    if(selectedDate && selectedDateFinal){
      if(new Date(selectedDateFinal) < new Date(selectedDate)){
        toast.error('Tanggal Invalid', {
          position: "top-center",
          description: 'Tanggal akhir harus lebih besar dari tanggal mulai',
          style: {
            width: '400px'
          }
        })
      } else {
        dispatch(getTransaction({start_date: selectedDate, end_date: selectedDateFinal}))
        dispatch(getTransactionForChart({start_date: selectedDate, end_date: selectedDateFinal}))
      }
    }
  },[selectedDate, selectedDateFinal, dispatch])

  const result = transaction.reduce<Props>(
    (acc, curr) => {
      if(curr!.status_proses === "selesai"){
        acc.selesai.push(curr!)
      } else {
        acc.belum_selesai.push(curr!)
      }
      return acc
    }, {
      selesai: [], belum_selesai: []
    }
  )

  const handleFilterDate = (range: string) => {
    if(range === 'all'){
      dispatch(getTransaction())
      dispatch(getTransactionForChart())
    }
    if(range === 'today'){
      const today = new Date()
      setSelectedDate(today)
      setSelectedDateFinal(today)
    }
    if(range === 'week'){
      const today = new Date()
      setSelectedDate(new Date(today.setDate(today.getDate() - 7)))
      setSelectedDateFinal(new Date())
    }
    if(range === 'month'){
      const today = new Date()
      setSelectedDate(new Date(today.setDate(1)))
      setSelectedDateFinal(today)
    }
    if(range === 'last_month'){
      const today = new Date()
      setSelectedDate(new Date(today.getFullYear(), today.getMonth() - 1, 1))
      setSelectedDateFinal(new Date(today.getFullYear(), today.getMonth(), 0))
    }
  }

  return (
    <div className='w-full flex flex-col items-center'>
      <Tabnav />
      <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[1000px] mt-10">
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
          <DatePicker label='Tanggal mulai' onDateChange={(date) => setSelectedDate(date)}/>
          <DatePicker label='Tanggal akhir' onDateChange={(date) => setSelectedDateFinal(date)}/>
        </Flex>
      </div>
      {loading ? (
        <Spinner className='mt-8 mb-4'/>  
      ): (  
        <div className="w-full sm:w-[600px] md:w-[700px] lg:w-[1000px]">
          <ChartBarInteractive data={data ?? []}/>
          <Flex gap="2" className='mt-3' justify="between" align="start">
            <Flex justify="center" align="center" direction="column" gap="1" className='w-1/2'>
              <Text className='font-bold text-end mb-1'>
                <Badge size="2" color='green'>Selesai</Badge>
              </Text>
              <DataTable columns={columns} data={result.selesai ?? []}/>
            </Flex>
            <Flex justify="center" align="center" direction="column" gap="1" className='w-1/2'>
              <Text className='font-bold text-end'>
                <Badge size="2" color='yellow'>
                  Belum Selesai
                </Badge>
              </Text>
              <DataTable columns={columns} data={result.belum_selesai ?? []}/>
            </Flex>
          </Flex>
        </div>
      )}
    </div>
  )
}

export default HistoryLayout
