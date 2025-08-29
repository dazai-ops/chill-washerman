"use client"

import { useEffect } from 'react'
import { Box, Card, Flex, Text, Select, TextField, RadioCards, TextArea, Button, Callout, Table } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import { getSingleTransaction, updateTransaction } from '@/lib/thunk/transaksi/transaksiThunk'
import { RootState } from '@/redux/store'
import { getApparel } from '@/lib/thunk/jenispakaian/jenispakaianThunk'
import { formatRupiah } from '@/utils/rupiahFormatter'
import { Transaction, TransactionDetail, CreateTransaction, CreateTransactionDetail } from '@/models/transaksitwo.model'
import { setTransactionOverviewField, calculateBalance, calculateServicePrice, calculateTotalPrice, addTransactionDetailForm, removeTransactionDetailForm, setTransactionDetailField } from '@/redux/slices/transaksiSlice'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import InputRupiah from '@/components/ui/InputRupiah/InputRupiah';

function TransaksiEditLayout({id}: {id:number}) {

  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const admin = useSelector((state: RootState) => state.auth.user)
  const {transactionOverview, transactionDetail, transactionDetailDelete, loading, status} = useSelector((state: RootState) => state.transaksi)
  const {apparelList} = useSelector((state: RootState) => state.jenisPakaian)

  const total_berat = transactionDetail.reduce((sum, detail) => sum + detail!.berat_kg, 0);
  const total_item = transactionDetail.reduce((sum, detail) => sum + detail!.jumlah_item, 0);
  const total_harga = transactionDetail.reduce((sum, detail) => sum + detail!.total_harga_layanan!, 0);

  useEffect(() => {
    if(transactionOverview.id !== null && transactionDetail[0]!.id !== null){
      console.log("overview", transactionOverview)
      console.log("detail",transactionDetail)
      console.log("delete",transactionDetailDelete)
    }
  },[transactionOverview, transactionDetail, transactionDetailDelete])
  
  useEffect(() => {
    dispatch(getSingleTransaction({id}))
    dispatch(getApparel())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  const overviewService = (key: keyof Partial<CreateTransaction>, value: string | number) => {
    dispatch(setTransactionOverviewField({key, value}))
  }

  useEffect(() => {
    dispatch(calculateBalance())
  }, [transactionOverview.dibayarkan, transactionOverview.total_harga, dispatch])

  useEffect(() => {
    dispatch(calculateTotalPrice())
  }, [transactionDetail, dispatch])

  const detailService = (index: number, key: keyof CreateTransactionDetail, value: string | number | boolean) => {
    dispatch(setTransactionDetailField({index, key, value}))

    const keyTriggerCalculate = ['jenis_pakaian', 'layanan_setrika', 'mesin_cuci', 'berat_kg', 'jumlah_item', 'acuan_harga']
    if(keyTriggerCalculate.includes(key)) {
      dispatch(calculateServicePrice({index: index}))
      dispatch(calculateTotalPrice())
    }
  }

  const detailJenisPakaian = (value: string | object, key: keyof CreateTransactionDetail, index: number) => {
    const selectedJenisPakaian = apparelList.find(jP => jP.id === Number(value))
    if(selectedJenisPakaian){
      dispatch(setTransactionDetailField({index, key, value: selectedJenisPakaian}))
    }
  }

  const deleteDetailJenisPakaian = (index: number, id?: number) => {
    dispatch(removeTransactionDetailForm({index, id}))
    toast.success("Item deleted", {
    })
  }

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(transactionDetail.length > 0) {
      for(let i = 0; i < transactionDetail.length; i++) {
        const item = transactionDetail[i]
        const nomorService = i + 1
        if(item!.jenis_pakaian.id === null) {
          return toast.error(`Select at least one item for service ${nomorService}`, {
            position: "top-center"
          })
        }
        if((item!.total_harga_layanan as number === 0)) {
          return toast.error(`Fill the form with valid data for service ${i+1}`, {
            description: 'Jumlah item/berat, layanan setrika, acuan harga',
            position: "top-center"
          })
        }
      }
    }
    if(transactionOverview && admin ) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const {dibuat_oleh, kembalian, sisa_bayar, ...transaksiOverview} = transactionOverview
      const overviewPayload = {
        ...transaksiOverview,
        updated_at: new Date() as unknown,
        updated_by: admin?.id as unknown
      }
      dispatch(updateTransaction({
        id: transactionOverview.id as number, 
        overview: overviewPayload as Partial<Transaction>, 
        detailTransaction: transactionDetail as Partial<TransactionDetail[]>, 
        deletedDetail: transactionDetailDelete as number[]
      }))
    }
  }

  useEffect(() => {
    if(status === 'success') {
      toast.success("Transaction updated successfully", {
        description: 'Please wait 5 seconds to redirect to transaction page'
      })
      const timer = setTimeout(() => {
        router.push('/transaksi')
      }, 500)
  
      return () => clearTimeout(timer)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  // useEffect(() => {
  //   console.log("overview", transactionOverview)
  //   console.log("detail",transactionDetail)
  // },[])

  return (
    <div className='w-full flex flex-col items-center'>
      <div className='w-full sm:w-[600px] md:w-[900px] lg:w-[1200px] mt-10'>
        <Callout.Root className='mb-2'>
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>
            Your changes will be saved untill you click the <b>save button.</b>
          </Callout.Text>
        </Callout.Root>
        <form onSubmit={(e) => formSubmit(e)}>
          {transactionOverview?.id ? (
            <Box width={"100%"} className='mb-3'>
              <Card size="2">
                <Flex direction="row" gap="4">
                  <Box>
                    <Box>
                      <Text size={"1"} weight={"bold"}>Kode Transaksi</Text>
                      <TextField.Root 
                        type='text'
                        name='kode_transaksi'
                        size={"2"} 
                        defaultValue={transactionOverview?.kode_transaksi}
                        readOnly 
                      />
                    </Box>
                    <Flex gap={"2"} className='mb-1'>
                      <Box>
                        <Text size={"1"} weight={"bold"}>Dibuat Oleh</Text>
                        <TextField.Root 
                          type='text'
                          name='dibuat_oleh'
                          size={"2"} 
                          defaultValue={transactionOverview?.dibuat_oleh?.nama}
                          readOnly 
                        />
                      </Box>
                      <Box>
                        <Text size={"1"} weight={"bold"}>Diedit Oleh</Text>
                        <TextField.Root 
                          type='text'
                          name='dibuat_oleh'
                          size={"2"} 
                          defaultValue={admin?.nama}
                          readOnly 
                        />
                      </Box>
                      
                    </Flex>
                    <Flex gap={"2"} className='mb-1'>
                      <Box>
                        <Text size={"1"} weight={"bold"}>Nama Customer</Text>
                        <TextField.Root 
                          type='text'
                          name='nama_pelanggan'
                          size={"2"}
                          className={`mb-1 `}
                          defaultValue={transactionOverview?.nama_pelanggan}
                          onChange={(e) => overviewService("nama_pelanggan", e.target.value)}
                        />
                      </Box>
                      <Box>
                        <Text size={"1"} weight={"bold"}>Telepon Customer</Text>
                        <TextField.Root 
                          type='number'
                          name='telepon_pelanggan'
                          size={"2"}
                          defaultValue={transactionOverview?.telepon_pelanggan || ""}
                          onChange={(e) => overviewService("telepon_pelanggan", e.target.value)}
                        />
                      </Box>
                    </Flex>
                    <Flex>
                      <Box width="66%">
                        <Text size={"1"} weight="bold">Catatan</Text>
                        <TextArea
                          defaultValue={transactionOverview?.catatan}
                          name='catatan' 
                          onChange={(e) => overviewService("catatan", e.target.value)}
                        />
                      </Box>
                    </Flex>
                  </Box>
                  <Box>
                    <Flex gap={"2"}>
                        <Box>
                          <Text size={"1"} weight={"bold"}>Sisa Bayar</Text>
                          <TextField.Root 
                            size={"2"} 
                            value={formatRupiah(Number(transactionOverview?.sisa_bayar))}
                            readOnly
                          />
                        </Box>
                        <Box>
                          <Text size={"1"} weight={"bold"}>Kembalian</Text>
                          <TextField.Root 
                            size={"2"} 
                            value={formatRupiah(Number(transactionOverview?.kembalian))}
                            readOnly
                          />
                        </Box>
                    </Flex>
                    <Flex gap={"2"}>
                      <Box>
                        <Text size={"1"} weight={"bold"} color='yellow'>Total Harga</Text>
                        <TextField.Root 
                          name='total_harga'
                          size={"2"}
                          value={ transactionOverview?.total_harga && formatRupiah(transactionOverview.total_harga) || 0}
                          readOnly
                        />
                      </Box>
                       <Box className='w-full'>
                        <InputRupiah
                          value={transactionOverview?.dibayarkan?.toString()}
                          style={{width: "155px"}}
                          label='Harga / (item)'
                          name='harga_per_item'
                          size='2'
                          labelSize='1'
                          className="mb-1"
                          labelColor='green'
                          onChange={(value: string) => overviewService('dibayarkan', Number(value))}
                        />
                      </Box>
                    </Flex>
                  </Box>
                  <Box width={"40%"}>
                    <Table.Root size="1" variant='surface'>
                      <Table.Header>
                        <Table.Row>
                          <Table.ColumnHeaderCell align='center'>No</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell align='center'>Jenis Pakaian</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell align='center'>Berat (kg)</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell align='center'>Jumlah</Table.ColumnHeaderCell>
                          <Table.ColumnHeaderCell align='center'>Biaya</Table.ColumnHeaderCell>
                        </Table.Row>
                      </Table.Header>
                      <Table.Body>
                        {transactionDetail.map((detail, index) => (
                          detail && (
                            <Table.Row key={index}>
                              <Table.RowHeaderCell align='center'>{index + 1}</Table.RowHeaderCell>
                              <Table.RowHeaderCell align='center'>{detail.jenis_pakaian.jenis_pakaian}</Table.RowHeaderCell>
                              <Table.Cell align='center'>{detail.berat_kg}</Table.Cell>
                              <Table.Cell align='center'>{detail.jumlah_item}</Table.Cell>
                              <Table.Cell align='center'>{formatRupiah(detail.total_harga_layanan)}</Table.Cell>
                            </Table.Row>
                          )
                        ))}
                          <Table.Row>
                            <Table.Cell colSpan={2} align='center' className='font-bold'>Total</Table.Cell>
                            <Table.Cell align='center' className='font-bold'>{total_berat}</Table.Cell>
                            <Table.Cell align='center' className='font-bold'>{total_item}</Table.Cell>
                            <Table.Cell align='center' className='font-bold'>{formatRupiah(total_harga)}</Table.Cell>
                          </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </Box>
                </Flex>
              </Card>
            </Box>
          ) : (
            <Box width={"100%"} className='mb-3'>
              <Card size="2">
                <Flex direction="column" gap="2">
                  <Text size={"1"} weight={"bold"}>Loading overview...</Text>
                </Flex>
              </Card>
            </Box>
          )}
          { transactionDetail && transactionDetail[0]?.id ? (
            <>
              {transactionDetail?.map((detail, index) => (
                detail && (
                  <Box key={index} width={"100%"}>
                    <Flex gap="4" className='mb-1' width={"100%"}>
                      <Card size="2" className='w-full'>
                        <Flex justify={"between"}>
                          <Text size="4" weight={"bold"}>
                            Service 
                            <Text color='red'> #{index + 1}</Text>
                          </Text>
                          <Box>
                            {transactionDetail.length > 1 && (
                              <Button color='red' size={"1"} type='button' onClick={() => deleteDetailJenisPakaian(index, Number(detail.id))}>
                                Hapus
                              </Button>
                            )}
                          </Box>
                        </Flex>
                        <Flex gap={"2"}>
                          {detail.jenis_pakaian && (
                            <Box width="200px">
                              <Box>
                                <Text size="1" weight="bold">Jenis Pakaian</Text>
                              </Box>
                              <Select.Root 
                                defaultValue={String(detail.jenis_pakaian?.id)} 
                                size={"2"}
                                name='jenis_pakaian'
                                onValueChange={(value) => detailJenisPakaian(value, "jenis_pakaian", index)}
                              >
                                <Select.Trigger placeholder='Pilih Jenis Pakaian' style={{ width: "100%" }} />
                                <Select.Content>
                                  <Select.Group>
                                    <Select.Label>Jenis Pakaian</Select.Label>
                                    {apparelList.map(( jenis_pakaian, index ) => (
                                      <Select.Item key={index} value={String(jenis_pakaian.id)}>
                                        {jenis_pakaian.jenis_pakaian}
                                      </Select.Item>
                                    ))}
                                  </Select.Group>
                                </Select.Content>
                              </Select.Root>
                            </Box>
                          )}
                          {detail.jenis_pakaian && (
                            <>
                              <Flex direction={"column"}>
                                <Flex gap={"2"} className='mb-1 w-full' justify={"between"}>
                                  <Flex gap={"2"} width={"350px"}>
                                    <Box width="50%">
                                      <Text size="1" weight="bold">Satuan Pakaian</Text>
                                      <TextField.Root 
                                        type='text'
                                        className="w-full" 
                                        size={"2"}
                                        value={detail.jenis_pakaian?.satuan}
                                        readOnly
                                      />
                                    </Box>
                                    <Box width="50%">
                                      <Text size="1" weight="bold">Harga / Kg</Text>
                                      <TextField.Root 
                                        className="w-full" 
                                        size={"2"} 
                                        value={formatRupiah(Number(detail.jenis_pakaian?.harga_per_kg))}
                                        readOnly
                                      />
                                    </Box>
                                  </Flex>
                                  <Flex gap={"2"} width={"350px"}>
                                    <Box width="50%">
                                      <Text size="1" weight="bold">Harga / Item</Text>
                                      <TextField.Root 
                                        className="w-full" 
                                        size={"2"} 
                                        value={formatRupiah(Number(detail.jenis_pakaian?.harga_per_item))}
                                        readOnly
                                      />
                                    </Box>
                                    <Box width="50%">
                                      <Text size="1" weight="bold" color='yellow'>Total Harga Layanan</Text>
                                      <TextField.Root 
                                        className="w-full" 
                                        name='total_harga_layanan'
                                        size={"2"}
                                        value={formatRupiah(detail.total_harga_layanan as number)}
                                        readOnly
                                      />
                                    </Box>
                                  </Flex>
                                </Flex>
                                {/* <DropdownMenu.Separator /> */}
                                <Flex gap={"2"} className='mb-1 mt-4'>
                                  <Flex width={"350px"} gap={"2"}>
                                    <Box width="50%">
                                      <Text size="1" weight="bold">Berat (kg)</Text>
                                      <TextField.Root
                                        type='number'
                                        step="any"
                                        className="w-full"
                                        name='berat_kg'
                                        size={"2"}
                                        defaultValue={String(detail.berat_kg)}
                                        onChange={(event) => detailService(index, "berat_kg", Number(event.target.value))}
                                      />
                                    </Box>
                                    <Box width="50%">
                                      <Text size="1" weight="bold">Jumlah Item</Text>
                                      <TextField.Root 
                                        type='number'
                                        className="w-full" 
                                        name='jumlah_item' 
                                        size={"2"}
                                        defaultValue={String(detail.jumlah_item)}
                                        onChange={(event) => detailService(index, "jumlah_item", Number(event.target.value))}
                                        />
                                    </Box>
                                  </Flex>
                                  <Flex gap={"2"} width={"350px"}>
                                    <Box width="50%">
                                      <Box>
                                        <Text size="1" weight="bold">Acuan Harga</Text>
                                      </Box>
                                      <Select.Root 
                                        size={"2"}
                                        name='mesin_cuci'
                                        defaultValue={detail.acuan_harga}
                                        onValueChange={(value) => detailService(index, "acuan_harga", value)}
                                      >
                                        <Select.Trigger style={{ width: "100%" }} />
                                        <Select.Content>
                                          <Select.Group>
                                            <Select.Label>Acuan harga</Select.Label>
                                            <Select.Item value="berat">Berat</Select.Item>
                                            <Select.Item value="item">Item</Select.Item>
                                          </Select.Group>
                                        </Select.Content>
                                      </Select.Root>
                                    </Box>
                                    <Box width="50%">
                                      <Text size="1" weight="bold">Layanan Setrika</Text>
                                      <RadioCards.Root
                                        name="layanan_setrika"
                                        
                                        columns={{ initial: "1", sm: "1" }} 
                                        size={"1"}
                                        defaultValue={String(detail.layanan_setrika)}
                                        onValueChange={(value) => detailService(index, "layanan_setrika", value === "true" ? true : false)}
                                      >
                                        <Flex gap={"2"} justify={"between"}>
                                          <RadioCards.Item value="true" style={{ width: "50%", height: "33px" }}>
                                            <Flex direction="column" width="100%">
                                              <Text className='text-center'>Iya</Text>
                                            </Flex>
                                          </RadioCards.Item>
                                          <RadioCards.Item value="false" style={{ width: "50%", height: "33px" }}>
                                            <Flex direction="column" width="100%">
                                              <Text className='text-center'>Tidak</Text>
                                            </Flex>
                                          </RadioCards.Item>
                                        </Flex>
                                      </RadioCards.Root>
                                    </Box>
                                  </Flex>
                                </Flex>
                                <Flex className='mb-1' justify={"between"} align={"end"}>
                                  <Flex gap={"2"} className='w-full'>
                                    <Box width="50%">
                                      <Text size={"1"} weight="bold">Catatan Admin</Text>
                                      <TextArea 
                                        name='catatan_admin'
                                        defaultValue={String(detail.catatan_admin)}
                                        onChange={(event) => detailService(index, "catatan_admin", event.target.value)}
                                      />
                                    </Box>
                                    <Box width="50%">
                                      <Text size={"1"} weight="bold">Catatan Pelanggan</Text>
                                      <TextArea 
                                        name='catatan_pelanggan' 
                                        defaultValue={String(detail.catatan_pelanggan)}
                                        onChange={(event) => detailService(index, "catatan_pelanggan", event.target.value)}
                                      />
                                    </Box>
                                  </Flex>
                                </Flex>
                              </Flex>
                            </>
                          )}
                        </Flex>
                      </Card>
                    </Flex>
                  </Box>
                )  
              ))}
            </>
          ) : (
            <Box width={"100%"}>
              <Card size="2">
                <Flex direction="column" gap="2">
                  <Text size={"1"} weight={"bold"}>Loading detail...</Text>
                </Flex>
              </Card>
            </Box>
          )}
          {!loading && (

            <Flex gap="2" className='mb-5 mt-3'>
              <Button type='submit' color='green'>
                  Save(simpan)
              </Button>
            <Button 
              type='button'
              onClick={() => dispatch(addTransactionDetailForm())}>
                New Service
            </Button>
            </Flex>
          )}
        </form>
      </div>
    </div>
  )
}

export default TransaksiEditLayout
