"use client"

import { Box, Tabs, Text, Card, Flex, Grid,TextField, Select, RadioCards, TextArea, Button } from '@radix-ui/themes';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { retriveJenisPakaian } from '@/lib/thunk/jenispakaian/jenispakaianThunk';
import { retriveMesinCuci } from '@/lib/thunk/mesincuci/mesincuciThunk';
import { addTransaksiDetailForm, calculateChangePrice, calculatePriceService, calculateTotalPrice, removeTransaksiDetailForm, setDetailedField, setOverview } from '@/redux/slices/transaksiSlice';
import { CreateTransaksiDetail, CreateTransaksiOverview } from '@/models/transaksi.model';
import { formatRupiah } from '@/utils/rupiahFormatter';
import { addTransaksi } from '@/lib/thunk/transaksi/transaksiThunk';

function CreateTransaksi() {
  const dispatch = useDispatch<AppDispatch>()
  const admin = useSelector((state: RootState) => state.auth.user)

  const jenisPakaianList = useSelector((state: RootState) => state.jenisPakaian.jenisPakaianCollection)
  const mesinCuciList = useSelector((state: RootState) => state.mesinCuci.mesinCuciCollection)

  const transaksiOverview = useSelector((state: RootState) => state.transaksi.transaksiOverview)
  const transaksiDetailList = useSelector((state: RootState) => state.transaksi.transaksiDetailList)

  const overviewService = (key: keyof CreateTransaksiOverview, value: string | number | boolean) => {
    dispatch(setOverview({key, value}))

    const keyTriggerCalculate = ['total_harga', 'dibayarkan']
    if(keyTriggerCalculate.includes(key)) {
      dispatch(calculateChangePrice())
    }
  }

  const detailJenisPakaian = (value: string | object, key: keyof CreateTransaksiDetail, index: number) => {
    const selectedJenisPakaian = jenisPakaianList.find(jP => jP.id === Number(value))
    if(selectedJenisPakaian){
      dispatch(setDetailedField({index, key, value: selectedJenisPakaian}))
    }
  }

  const detailService = (index: number, key: keyof CreateTransaksiDetail, value: string | number | boolean) => {
    dispatch(setDetailedField({index, key, value}))

    const keyTriggerCalculate = ['jenis_pakaian', 'layanan_setrika', 'mesin_cuci', 'berat_kg', 'jumlah_item', 'acuan_harga']
    if(keyTriggerCalculate.includes(key)) {
      dispatch(calculatePriceService({index: index}))
      dispatch(calculateTotalPrice())
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(addTransaksi({
      transaksi: transaksiOverview, 
      transaksiDetail: transaksiDetailList
    }))
  }

  useEffect(() => {
    if(admin) {
      dispatch(setOverview({
        key: 'dibuat_oleh',
        value: admin
      }))
    }
  }, [admin, dispatch])

  useEffect(() => {
    dispatch(retriveJenisPakaian())
    dispatch(retriveMesinCuci({status_mesin: 'tidak_digunakan', is_active: 'true'}))
  },[dispatch])

  return (
    <div className='w-full flex flex-col items-center'>
      <Tabs.Root defaultValue="overview" className='w-full sm:w-[600px] md:w-[700px] lg:w-[1000px] mt-10'>
        <Tabs.List >
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="service">Service</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <form onSubmit={handleSubmit}>
            <Tabs.Content value="overview">
              <Box>
                <Card size="2">
                  <Flex direction="column" gap="3">
                    <Grid gap="1">
                      <Flex gap={"2"} className='mb-3'>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Nama Admin</Text>
                          <TextField.Root 
                            type='text'
                            name='dibuat_oleh'
                            size={"3"} 
                            value={transaksiOverview.dibuat_oleh?.nama}
                            // onChange={(event) => handleOverview('dibuat_oleh', event)} 
                            readOnly 
                          />
                        </Box>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Kode Transaksi</Text>
                          <TextField.Root 
                            type='text'
                            name='kode_transaksi'
                            size={"3"} 
                            value={transaksiOverview.kode_transaksi}
                            onChange={(event) => overviewService('kode_transaksi', event.target.value)}
                            readOnly 
                          />
                        </Box>
                      </Flex>
                      <Flex gap={"2"}>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Nama Customer</Text>
                          <TextField.Root 
                            type='text'
                            name='nama_pelanggan'
                            size={"3"}
                            value={transaksiOverview.nama_pelanggan}
                            onChange={(event) => overviewService('nama_pelanggan', event.target.value)}
                          />
                        </Box>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Telepon Customer</Text>
                          <TextField.Root 
                            type='number'
                            name='telepon_pelanggan'
                            size={"3"}
                            value={transaksiOverview.telepon_pelanggan}
                            onChange={(event) => overviewService('telepon_pelanggan', event.target.value)}
                          />
                        </Box>
                      </Flex>
                      <Flex gap={"2"} className='my-4'>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Total Harga</Text>
                          <TextField.Root 
                            name='total_harga'
                            size={"3"}
                            value={ transaksiOverview.total_harga && formatRupiah(transaksiOverview.total_harga) || "Rp 0"}
                            readOnly
                          />
                        </Box>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Dibayarkan</Text>
                          <TextField.Root 
                            type='number'
                            name='dibayarkan'
                            size={"3"}
                            value={String(transaksiOverview.dibayarkan)}
                            disabled={transaksiOverview.total_harga === 0}
                            onChange={(event) => overviewService('dibayarkan', Number(event.target.value))}
                          >
                            <TextField.Slot>
                              Rp
                            </TextField.Slot>
                          </TextField.Root>
                        </Box>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Sisa Bayar</Text>
                          <TextField.Root 
                            size={"3"} 
                            value={formatRupiah(transaksiOverview.sisa_bayar)}
                            readOnly
                          />
                        </Box>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Kembalian</Text>
                          <TextField.Root 
                            size={"3"} 
                            value={formatRupiah(transaksiOverview.kembalian)}
                            readOnly
                          />
                        </Box>
                      </Flex>
                      <Flex>
                        <Box width="250px">
                          <Text size={"2"} weight="bold">Catatan</Text>
                          <TextArea
                            value={transaksiOverview.catatan}
                            onChange={(event) => overviewService('catatan', event.target.value)}
                            name='catatan' 
                          />
                        </Box>
                      </Flex>
                    </Grid>
                  </Flex>
                </Card>
              </Box>
            </Tabs.Content>

            <Tabs.Content value="service">
              <Box>
                {transaksiDetailList.map((transaksiDetailData, index) => (
                  <Card size="2" key={index} className='mb-3'>
                    <Text size="4" weight={"bold"}>
                      Service 
                      <Text color='red'> #{index + 1}</Text>
                    </Text>
                    
                    <Flex gap="4" className='mb-3'>
                      <Box width="200px">
                        <Box>
                          <Text size="2" weight="bold">Jenis Pakaian</Text>
                        </Box>
                        <Select.Root 
                          value={String(transaksiDetailData.jenis_pakaian?.id)} 
                          size={"3"}
                          name='jenis_pakaian'
                          onValueChange={(value) => detailJenisPakaian(value, 'jenis_pakaian', index)}
                        >
                          <Select.Trigger placeholder='Pilih Jenis Pakaian' style={{ width: "100%" }} />
                          <Select.Content>
                            <Select.Group>
                              <Select.Label>Jenis Pakaian</Select.Label>
                              {jenisPakaianList.map(( jenis_pakaian, index ) => (
                                <Select.Item key={index} value={String(jenis_pakaian.id)}>
                                  {jenis_pakaian.jenis_pakaian}
                                </Select.Item>
                              ))}
                            </Select.Group>
                          </Select.Content>
                        </Select.Root>
                      </Box>
                      
                      {transaksiDetailData.jenis_pakaian?.jenis_pakaian && (
                        <>
                          <Box width="200px">
                            <Text size="2" weight="bold">Satuan Pakaian</Text>
                            <TextField.Root 
                              type='text'
                              className="w-full" 
                              size={"3"}
                              value={transaksiDetailData.jenis_pakaian?.satuan || "-"}
                              readOnly
                            />
                          </Box>
                          <Box width="200px">
                            <Text size="2" weight="bold">Harga / Kg</Text>
                            <TextField.Root 
                              // type='number'
                              className="w-full" 
                              size={"3"} 
                              value={ transaksiDetailData.jenis_pakaian?.harga_per_kg && formatRupiah(transaksiDetailData.jenis_pakaian?.harga_per_kg) || "-"}
                              readOnly
                            />
                          </Box>
                          <Box width="200px">
                            <Text size="2" weight="bold">Harga / Item</Text>
                            <TextField.Root 
                              className="w-full" 
                              size={"3"} 
                              value={ transaksiDetailData.jenis_pakaian?.harga_per_item && formatRupiah(transaksiDetailData.jenis_pakaian?.harga_per_item) || "-"}
                              readOnly
                            />
                          </Box>
                        </>       
                      )}
                    </Flex>
                    {transaksiDetailData.jenis_pakaian?.jenis_pakaian && (
                      <>
                        <Flex gap={"4"} className='mb-3'>
                          <Box width="200px">
                            <Text size="2" weight="bold">Berat (kg)</Text>
                            <TextField.Root
                              type='number'
                              className="w-full"
                              name='berat_kg'
                              size={"3"}
                              value={String(transaksiDetailData.berat_kg)}
                              onChange={(event) => detailService(index, 'berat_kg', Number(event.target.value))}
                            />
                          </Box>
                          <Box width="200px">
                            <Text size="2" weight="bold">Jumlah Item</Text>
                            <TextField.Root 
                              type='number'
                              className="w-full" 
                              name='jumlah_item' 
                              size={"3"}
                              value={String(transaksiDetailData.jumlah_item)}
                              onChange={(event) => detailService(index, 'jumlah_item', Number(event.target.value))}
                            />
                          </Box>
                          <Box maxWidth="600px">
                            <Text size="2" weight="bold">Layanan Setrika</Text>
                            <RadioCards.Root
                              name="layanan_setrika"
                              columns={{ initial: "1", sm: "1" }} 
                              size={"1"}
                              value={String(transaksiDetailData.layanan_setrika)}
                              onValueChange={(value) => detailService(index, 'layanan_setrika', value === "true" ? true : false)}
                            >
                              <Flex gap={"2"}>
                                <RadioCards.Item value="true">
                                  <Flex direction="column" width="100%">
                                    <Text>Iya</Text>
                                  </Flex>
                                </RadioCards.Item>
                                <RadioCards.Item value="false">
                                  <Flex direction="column" width="100%">
                                    <Text>Tidak</Text>
                                  </Flex>
                                </RadioCards.Item>
                              </Flex>
                            </RadioCards.Root>
                          </Box>
                        </Flex>
                        <Flex gap={"4"} className='mb-3'>
                          <Box width="200px">
                            <Box>
                              <Text size="2" weight="bold">Mesin Cuci</Text>
                            </Box>
                            <Select.Root 
                              size={"3"}
                              name='mesin_cuci'
                              value={String(transaksiDetailData.mesin_cuci)}
                              onValueChange={(value) => detailService(index, 'mesin_cuci', Number(value))}
                            >
                              <Select.Trigger placeholder='Pilih Mesin Cuci' style={{ width: "100%" }} />
                              <Select.Content>
                                <Select.Group>
                                  <Select.Label>Mesin Cuci</Select.Label>
                                  {mesinCuciList.map((mesinCuci, index) => (
                                    <Select.Item key={index} value={String(mesinCuci.id)}>
                                      {mesinCuci.merk + " " + mesinCuci.seri}
                                    </Select.Item>
                                  ))}
                                </Select.Group>
                              </Select.Content>
                            </Select.Root>
                          </Box>
                          <Box width="200px">
                            <Box>
                              <Text size="2" weight="bold">Acuan Harga</Text>
                            </Box>
                            <Select.Root 
                              size={"3"}
                              name='mesin_cuci'
                              value={String(transaksiDetailData.acuan_harga)}
                              onValueChange={(value) => detailService(index, 'acuan_harga', value)}
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
                          <Box>
                            <Text size="2" weight="bold">Total Harga</Text>
                            <TextField.Root 
                              className="w-full" 
                              name='total_harga_layanan'
                              size={"3"}
                              value={formatRupiah(transaksiDetailData.total_harga_layanan)}
                              readOnly
                            />
                          </Box>
                        </Flex>
                        <Flex gap={"4"} className='mb-3'>
                          <Box width="250px">
                            <Text size={"2"} weight="bold">Catatan Admin</Text>
                            <TextArea 
                              name='catatan_admin'
                              value={String(transaksiDetailData.catatan_admin)}
                              onChange={(event) => detailService(index, 'catatan_admin', event.target.value)}
                            />
                          </Box>
                          <Box width="250px">
                            <Text size={"2"} weight="bold">Catatan Pelanggan</Text>
                            <TextArea 
                              name='catatan_pelanggan' 
                              value={String(transaksiDetailData.catatan_pelanggan)}
                              onChange={(event) => detailService(index, 'catatan_pelanggan', event.target.value)}
                            />
                          </Box>
                        </Flex>
                        
                        {index > 0 && (
                          <Button color='red' onClick={() => dispatch(removeTransaksiDetailForm(index))}>
                            Hapus
                          </Button>
                        )}
                      </>
                    )}
                  </Card>
                ))}
                <Flex gap="2" className='mb-5'>
                  <Button type='submit'>
                      Save(simpan)
                  </Button>
                  <Button 
                    type='button'
                    onClick={() => dispatch(addTransaksiDetailForm())}>
                      New Service
                  </Button>
                </Flex>
              </Box>
            </Tabs.Content>
          </form>
        </Box>
      </Tabs.Root>
    </div>
  )
}

export default CreateTransaksi
