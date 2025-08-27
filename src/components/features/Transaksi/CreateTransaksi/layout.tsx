"use client"

//lib
import { toast } from 'sonner';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Box, Text, Card, Flex,TextField, Select, RadioCards, TextArea, Button, Table, Callout } from '@radix-ui/themes';

//redux
import { AppDispatch, RootState } from '@/redux/store';
import { getApparel } from '@/lib/thunk/jenispakaian/jenispakaianThunk';
import { addTransaction } from '@/lib/thunk/transaksi/transaksiThunk';
import { addTransactionDetailForm, calculateBalance, calculateServicePrice, calculateTotalPrice, removeTransactionDetailForm, setTransactionDetailField, setTransactionOverviewField } from '@/redux/slices/transaksiSlice';

//utils
import { formatRupiah } from '@/utils/rupiahFormatter';
import { CreateTransactionDetail, CreateTransactionOverview } from '@/models/transaksi.model';


function CreateTransaksiForm() {
  const dispatch = useDispatch<AppDispatch>()

  const admin = useSelector((state: RootState) => state.auth.user)
  const {apparelList} = useSelector((state: RootState) => state.jenisPakaian)
  const {transactionOverview, transactionDetail, status} = useSelector((state: RootState) => state.transaksi)

  const totalWeight = transactionDetail.reduce((sum, detail) => sum + detail!.berat_kg, 0);
  const totalItems = transactionDetail.reduce((sum, detail) => sum + detail!.jumlah_item, 0);
  const totalPrice = transactionDetail.reduce((sum, detail) => sum + detail!.total_harga_layanan, 0);

  // set current admin
  useEffect(() => {
    if(admin) {
      dispatch(setTransactionOverviewField({
        key: 'dibuat_oleh',
        value: admin
      }))
    }
  }, [admin, dispatch])

  // fetch clothing types
  useEffect(() => {
    dispatch(getApparel())
  },[dispatch])
  
  // update overview
  const updateTransactionOverview = (key: keyof CreateTransactionOverview, value: string | number | boolean) => {
    dispatch(setTransactionOverviewField({key, value}))
  }

  // update detail (service)
  const updateTransactionDetail = (index: number, key: keyof CreateTransactionDetail, value: string | number | boolean) => {
    dispatch(setTransactionDetailField({index, key, value}))

    const keyTriggerCalculate = ['jenis_pakaian', 'layanan_setrika', 'mesin_cuci', 'berat_kg', 'jumlah_item', 'acuan_harga']
    if(keyTriggerCalculate.includes(key)) {
      dispatch(calculateServicePrice({index: index}))
      dispatch(calculateTotalPrice())
    }
  }

  // update clothing type (calculate price as well)
  const updateClothingType = (value: string | object, key: keyof CreateTransactionDetail, index: number) => {
    const selectedClothing = apparelList.find(jP => jP.id === Number(value))

    if(selectedClothing) dispatch(setTransactionDetailField({index, key, value: selectedClothing}))

    dispatch(calculateServicePrice({index: index}))
    dispatch(calculateTotalPrice())
  }

  // handle submit form
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(transactionOverview.nama_pelanggan === '') {
      return toast.error('Nama pelanggan is required', {
        position: "top-center"
      })
    }
    for(let i = 0; i < transactionDetail.length; i++) {
      const item = transactionDetail[i]
      const serviceNumber = i + 1
      if(item!.jenis_pakaian.id === null) {
        return toast.error(`Select at least one item for service ${serviceNumber}`, {
          position: "top-center"
        })
      }
      if(item!.total_harga_layanan === 0){
        return toast.error(`Fill the form with valid data for service ${i+1}`, {
          description: 'Jumlah item/berat, layanan setrika, acuan harga',
          position: "top-center"
        })
      }
    }

    dispatch(addTransaction({
      transaction: transactionOverview, 
      transactionDetail: transactionDetail
    }))
  }

  // trigger calculate balance when (dibayarkan or total_harga) change
  useEffect(() => {
    dispatch(calculateBalance())
  }, [transactionOverview.dibayarkan, transactionOverview.total_harga, dispatch])

  // trigger calculate total price when (transaction detail) change
  useEffect(() => {
    dispatch(calculateTotalPrice())
  },[transactionDetail, dispatch])

  // reload page when transaction success (status)
  useEffect(() => {
    if(status === 'success') {
      const timer = setTimeout(() => {
        window.location.reload()
      }, 1000)
  
      return () => clearTimeout(timer)
    }
  }, [status])

  // DEBUG ------------------------------------------
  // useEffect(() => {
  //   console.log("Overviw", transactionOverview)
  //   console.log("Detail",transactionDetail)
  // },[transactionOverview, transactionDetail])

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
        {admin?.nama ? (
          <form onSubmit={handleSubmit}>
            <Box>
              <Card size="2" className='mb-3'>
                <Flex gap="2">
                  <Flex direction={"column"}>
                    <Flex gap={"2"} className='mb-1'>
                      <Box>
                        <Text size={"1"} weight={"bold"}>Nama Admin</Text>
                        <TextField.Root 
                          type='text'
                          name='dibuat_oleh'
                          size={"2"} 
                          value={transactionOverview.dibuat_oleh?.nama}
                          readOnly 
                        />
                      </Box>
                      <Box>
                        <Text size={"1"} weight={"bold"}>Kode Transaksi</Text>
                        <TextField.Root 
                          type='text'
                          name='kode_transaksi'
                          size={"2"} 
                          value={transactionOverview.kode_transaksi}
                          onChange={(event) => updateTransactionOverview('kode_transaksi', event.target.value)}
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
                          className='mb-1'
                          value={transactionOverview.nama_pelanggan}
                          onChange={(event) => updateTransactionOverview('nama_pelanggan', event.target.value)}
                        />
                      </Box>
                      <Box>
                        <Text size={"1"} weight={"bold"}>Telepon Customer</Text>
                        <TextField.Root 
                          type='number'
                          name='telepon_pelanggan'
                          size={"2"}
                          value={transactionOverview?.telepon_pelanggan || ""}
                          onChange={(event) => updateTransactionOverview('telepon_pelanggan', event.target.value)}
                        />
                      </Box>
                    </Flex>
                    <Flex>
                      <Box width="100%">
                        <Text size={"1"} weight="bold">Catatan</Text>
                        <TextArea
                          value={transactionOverview.catatan}
                          onChange={(event) => updateTransactionOverview('catatan', event.target.value)}
                          name='catatan' 
                        />
                      </Box>
                    </Flex>
                  </Flex>
                  <Flex direction={"column"}>
                    <Flex gap={"2"}>
                      <Box>
                        <Text size={"1"} weight={"bold"}>Sisa Bayar</Text>
                        <TextField.Root 
                          size={"2"} 
                          value={ transactionOverview.status_pembayaran && formatRupiah(transactionOverview.sisa_bayar)}
                          readOnly
                        />
                      </Box>
                      <Box>
                        <Text size={"1"} weight={"bold"}>Kembalian</Text>
                        <TextField.Root 
                          size={"2"} 
                          value={formatRupiah(transactionOverview.kembalian)}
                          readOnly
                        />
                      </Box>
                    </Flex>
                    <Flex gap={"2"}>
                      <Box>
                        <Box>
                          <Text size={"1"} weight={"bold"} color='yellow'>Total Harga</Text>
                          <TextField.Root 
                            name='total_harga'
                            size={"2"}
                            value={formatRupiah(transactionOverview?.total_harga)}
                            readOnly
                          />
                        </Box>
                      </Box>
                      <Box>
                        <Text size={"1"} weight={"bold"} color='green'>Dibayarkan</Text>
                        <TextField.Root 
                          // type='number'
                          style={{width: "155px"}}
                          name='dibayarkan'
                          size={"2"}
                          value={String(transactionOverview.dibayarkan)}
                          disabled={transactionOverview.total_harga === 0}
                          onChange={(event) => updateTransactionOverview('dibayarkan', Number(event.target.value))}
                        >
                          <TextField.Slot>
                            Rp
                          </TextField.Slot>
                        </TextField.Root>
                      </Box>
                    </Flex>

                  </Flex>
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
                          <Table.Row key={index}>
                            <Table.RowHeaderCell align='center'>{index + 1}</Table.RowHeaderCell>
                            <Table.RowHeaderCell align='center'>{detail.jenis_pakaian.jenis_pakaian}</Table.RowHeaderCell>
                            <Table.Cell align='center'>{detail.berat_kg}</Table.Cell>
                            <Table.Cell align='center'>{detail.jumlah_item}</Table.Cell>
                            <Table.Cell align='center'>{formatRupiah(detail.total_harga_layanan)}</Table.Cell>
                          </Table.Row>
                        ))}
                          <Table.Row>
                            <Table.Cell colSpan={2} align='center' className='font-bold'>Total</Table.Cell>
                            <Table.Cell align='center' className='font-bold'>{totalWeight}</Table.Cell>
                            <Table.Cell align='center' className='font-bold'>{totalItems}</Table.Cell>
                            <Table.Cell align='center' className='font-bold'>{formatRupiah(totalPrice)}</Table.Cell>
                          </Table.Row>
                      </Table.Body>
                    </Table.Root>
                  </Box>
                </Flex>
              </Card>
            </Box>

            <Box>
              {transactionDetail.map((detail, index) => (
                <Card size="2" key={index} className='mb-1'>
                  <Flex justify={"between"}>
                    <Text size="4" weight={"bold"}>
                      Service 
                      <Text color='red'> #{index + 1}</Text>
                    </Text>
                    <Box>
                      {transactionDetail.length > 1 && (
                        <Button color='red' size={"1"} type='button' onClick={() => dispatch(removeTransactionDetailForm({index}))}>
                          Hapus
                        </Button>
                      )}
                    </Box>
                  </Flex>
                  
                  <Flex gap="4" className='mb-1'>
                    <Box width="200px">
                      <Box>
                        <Text size="1" weight="bold">Jenis Pakaian</Text>
                      </Box>
                      <Select.Root 
                        value={String(detail.jenis_pakaian?.id)} 
                        size={"2"}
                        name='jenis_pakaian'
                        onValueChange={(value) => updateClothingType(value, 'jenis_pakaian', index)}
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
                    
                    
                    {detail.jenis_pakaian?.jenis_pakaian && (
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
                                  value={detail.jenis_pakaian?.satuan || "-"}
                                  readOnly
                                />
                              </Box>
                              <Box width="50%">
                                <Text size="1" weight="bold">Harga / Kg</Text>
                                <TextField.Root 
                                  // type='number'
                                  className="w-full" 
                                  size={"2"} 
                                  value={ detail.jenis_pakaian?.harga_per_kg && formatRupiah(detail.jenis_pakaian?.harga_per_kg) || "-"}
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
                                  value={ detail.jenis_pakaian?.harga_per_item && formatRupiah(detail.jenis_pakaian?.harga_per_item) || "-"}
                                  readOnly
                                />
                              </Box>
                              <Box width="50%">
                                <Text size={"1"} weight={"bold"} color='yellow'>Total Harga</Text>
                                <TextField.Root 
                                  name='total_harga'
                                  size={"2"}
                                  value={ detail.total_harga_layanan && formatRupiah(detail.total_harga_layanan) || "Rp 0"}
                                  readOnly
                                />
                              </Box>
                            </Flex>
                          </Flex>
                          <Flex gap={"2"}>
                            <Flex gap={"2"} width={"350px"}>
                              <Box width="50%">
                                <Text size="1" weight="bold">Berat (kg)</Text>
                                <TextField.Root
                                  type='number'
                                  className="w-full"
                                  name='berat_kg'
                                  size={"2"}
                                  value={String(detail.berat_kg)}
                                  onChange={(event) => updateTransactionDetail(index, 'berat_kg', Number(event.target.value))}
                                />
                              </Box>
                              <Box width="50%">
                                <Text size="1" weight="bold">Jumlah Item</Text>
                                <TextField.Root 
                                  type='number'
                                  className="w-full" 
                                  name='jumlah_item' 
                                  size={"2"}
                                  value={String(detail.jumlah_item)}
                                  onChange={(event) => updateTransactionDetail(index, 'jumlah_item', Number(event.target.value))}
                                />
                              </Box>
                            </Flex>
                            <Flex gap={"2"} width={"350px"}>
                              <Box width="50%">
                                <Text size="1" weight="bold">Layanan Setrika</Text>
                                <RadioCards.Root
                                  name="layanan_setrika"
                                  columns={{ initial: "1", sm: "1" }} 
                                  size={"1"}
                                  value={String(detail.layanan_setrika)}
                                  onValueChange={(value) => updateTransactionDetail(index, 'layanan_setrika', value === "true" ? true : false)}
                                >
                                  <Flex gap={"2"}>
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
                              <Box width="50%">
                                <Box>
                                  <Text size="1" weight="bold">Acuan Harga</Text>
                                </Box>
                                <Select.Root 
                                  size={"2"}
                                  name='mesin_cuci'
                                  value={String(detail.acuan_harga)}
                                  onValueChange={(value) => updateTransactionDetail(index, 'acuan_harga', value)}
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
                            </Flex>
                          </Flex>
                          <Flex gap={"2"}>
                            <Box width="50%">
                              <Text size={"1"} weight="bold">Catatan Admin</Text>
                              <TextArea 
                                name='catatan_admin'
                                value={String(detail.catatan_admin)}
                                onChange={(event) => updateTransactionDetail(index, 'catatan_admin', event.target.value)}
                              />
                            </Box>
                            <Box width="50%">
                              <Text size={"1"} weight="bold">Catatan Pelanggan</Text>
                              <TextArea 
                                name='catatan_pelanggan' 
                                value={String(detail.catatan_pelanggan)}
                                onChange={(event) => updateTransactionDetail(index, 'catatan_pelanggan', event.target.value)}
                              />
                            </Box>
                          </Flex>
                        </Flex>
                      </>       
                    )}
                  </Flex>
                </Card>
              ))}
              <Flex gap="2" className='mb-5 mt-2'>
                <Button type='submit' color='green'>
                    Save(simpan)
                </Button>
                <Button 
                  type='button'
                  onClick={() => dispatch(addTransactionDetailForm())}>
                    New Service
                </Button>
              </Flex>
            </Box>
          </form>
        ) : (
          <Box width={"100%"} className='mb-3'>
            <Card size="2">
              <Flex direction="column" gap="2">
                <Text size={"1"} weight={"bold"}>Preparing esentials...</Text>
              </Flex>
            </Card>
          </Box>
        )}
      </div>
    </div>
  )
}

export default CreateTransaksiForm
