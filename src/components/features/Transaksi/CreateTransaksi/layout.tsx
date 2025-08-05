"use client"

import { Box, Tabs, Text, Card, Flex, Grid,TextField, Select, RadioCards, TextArea, Button } from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { retriveJenisPakaian } from '@/lib/thunk/jenispakaian/jenispakaianThunk';
import { retriveMesinCuci } from '@/lib/thunk/mesincuci/mesincuciThunk';
import { generateTransaksiCode } from '@/utils/generateCode';
import { countKembalian, countPriceService } from '@/features/transaksi/countPrice';
import { formatRupiah } from '@/utils/rupiahFormatter';
import { addTransaksi } from '@/lib/thunk/transaksi/transaksiThunk';

import { JenisPakaian } from '@/models/jenispakaian.model';
import { CreateTransaksiDetail, CreateTransaksiOverview} from '@/models/transaksi.model';

function CreateTransaksi() {
  const dispatch = useDispatch<AppDispatch>()
  const admin = useSelector((state: RootState) => state.auth.user)

  const jenisPakaianList = useSelector((state: RootState) => state.jenisPakaian.jenisPakaianCollection)
  const mesinCuciList = useSelector((state: RootState) => state.mesinCuci.mesinCuciCollection)

  const [selectedJenisPakaianDetail, setSelectedJenisPakaianDetail] = useState<JenisPakaian | null>(null)

  const [acuanHarga, setAcuanHarga] = useState('')
  const [kembalian, setKembalian] = useState(0)
  const [sisaBayar, setSisaBayar] = useState(0)

  const [overviewData, setOverviewData] = useState<CreateTransaksiOverview>({
    dibuat_oleh: Number(admin?.id),
    kode_transaksi: generateTransaksiCode(),
    nama_pelanggan: '',
    telepon_pelanggan: '',
    catatan:'',
    total_harga: 0,
    dibayarkan: 0,
    status_pembayaran:''
  })

  const [transaksiDetailData, setTransaksiDetailData] = useState<CreateTransaksiDetail>({
    jenis_pakaian: "",
    berat_kg: 0,
    jumlah_item: 0,
    layanan_setrika: true,
    mesin_cuci: '',
    total_harga_layanan: 0,
    catatan_admin: '',
    catatan_pelanggan: '',
    transaksi_parent: ''
  })

  // handle overview form
  const handleOverview = (
    key: keyof typeof overviewData,
    valueOrEvent: string|React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = 
      typeof valueOrEvent === 'string'
      ? valueOrEvent
      : valueOrEvent.target.value

    setOverviewData({
      ...overviewData,
      [key]: value
    })
  }

  // handle detail form
  const handleService = (
    key: keyof typeof transaksiDetailData,
    valueOrEvent: string|React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const rawValue = 
      typeof valueOrEvent === 'string'
      ? valueOrEvent
      : valueOrEvent.target.value

      const booleanFields = ['layanan_setrika'];

      const value =
        booleanFields.includes(key) ? rawValue === 'true'
        : rawValue;

      setTransaksiDetailData({
      ...transaksiDetailData,
      [key]: value
    })
  }

  // on "Jenis Pakaian" change or select
  const handleSelectJenisPakaian = (value: string) => {
    const selected = jenisPakaianList.find(jP => jP.id === Number(value))
    if(selected){
      setSelectedJenisPakaianDetail(selected)
      setTransaksiDetailData((total) => ({
        ...total,
        jenis_pakaian: String(selected.id)
      }))
    }
  }

  // count each service price
  useEffect(() => {
    if(transaksiDetailData.jenis_pakaian &&
      (transaksiDetailData.berat_kg > 0 || transaksiDetailData.jumlah_item > 0) &&
      transaksiDetailData.layanan_setrika !== null &&
      transaksiDetailData.mesin_cuci &&
      (acuanHarga === 'berat' || acuanHarga === 'item')
    ) {
      if(selectedJenisPakaianDetail){
        const harga = countPriceService(
          transaksiDetailData.berat_kg as number,
          transaksiDetailData.jumlah_item as number,
          selectedJenisPakaianDetail.harga_per_kg || 0,
          selectedJenisPakaianDetail.harga_per_item,
          acuanHarga,
          transaksiDetailData.layanan_setrika 
        )
        setTransaksiDetailData((total) => ({
          ...total,
          total_harga_layanan: harga || 0
        }))
        setOverviewData((total) => ({
          ...total,
          total_harga: transaksiDetailData.total_harga_layanan
        }))
      }

    } else {
      setTransaksiDetailData((total) => ({
        ...total,
        total_harga_layanan: 0
      }))
    }
  }, [
    transaksiDetailData.berat_kg,
    transaksiDetailData.jumlah_item,
    transaksiDetailData.layanan_setrika,
    transaksiDetailData.mesin_cuci,
    transaksiDetailData.jenis_pakaian,
    transaksiDetailData.total_harga_layanan,
    selectedJenisPakaianDetail,
    acuanHarga,
  ])

  // fetch current admin
  useEffect(() => {
    if(admin) {
      setOverviewData({
        ...overviewData,
        dibuat_oleh: Number(admin.id) ?? ""
      })
    }
  }, [admin])

  // count change(kembalian and sisa bayar)
  useEffect(() => {
    if(overviewData.total_harga > 0 && overviewData.dibayarkan > 0) {
      const kembalian = countKembalian(overviewData.total_harga as number, overviewData.dibayarkan as number)
      if(kembalian > 0) {
        setKembalian(Number(kembalian))
        setSisaBayar(0)
        setOverviewData((total) => ({
          ...total,
          status_pembayaran: 'lunas'
        }))
      } else {
        setKembalian(0)
        setSisaBayar(Number(-kembalian))
      }
    } else if (overviewData.dibayarkan <= 0 || overviewData.dibayarkan < overviewData.total_harga) {
      setOverviewData((total) => ({
        ...total,
        status_pembayaran: 'belum_lunas'
      }))
      setKembalian(0)
      setSisaBayar(0)
    }
  }, [
    overviewData.total_harga,
    overviewData.dibayarkan
  ])

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    dispatch(addTransaksi({
      transaksi: overviewData, 
      transaksiDetail: transaksiDetailData
    }))
  }
  useEffect(() => {
    dispatch(retriveJenisPakaian())
    dispatch(retriveMesinCuci())
  },[])
  
  return (
    <div className='w-full flex flex-col items-center'>
      <Tabs.Root defaultValue="overview" className='w-full sm:w-[600px] md:w-[700px] lg:w-[1000px] mt-10'>
        <Tabs.List >
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="service">Service</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <form onSubmit={(e) => handleSubmit(e)}>
          {/* <form> */}
            <Tabs.Content value="overview">
              <Box>
                <Card size="2">
                  <Flex direction="column" gap="3">
                    <Grid gap="1">
                      <Flex gap={"2"} className='mb-4'>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Nama Admin</Text>
                          <TextField.Root 
                            name='dibuat_oleh'
                            size={"3"} 
                            value={admin?.nama ?? ''}
                            onChange={(event) => handleOverview('dibuat_oleh', event)} 
                            readOnly 
                          />
                        </Box>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Kode Transaksi</Text>
                          <TextField.Root 
                            name='kode_transaksi'
                            size={"3"} 
                            value={overviewData.kode_transaksi}
                            onChange={(event) => handleOverview('kode_transaksi', event)}
                            readOnly 
                          />
                        </Box>
                      </Flex>
                      <Flex gap={"2"}>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Nama Customer</Text>
                          <TextField.Root 
                            name='nama_pelanggan'
                            value={overviewData.nama_pelanggan}
                            size={"3"}
                            onChange={(event) => handleOverview('nama_pelanggan', event)}
                          />
                        </Box>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Telepon Customer</Text>
                          <TextField.Root 
                            name='telepon_pelanggan'
                            value={overviewData.telepon_pelanggan}
                            size={"3"} 
                            onChange={(event) => handleOverview('telepon_pelanggan', event)}
                          />
                        </Box>
                      </Flex>
                      <Flex gap={"2"} className='my-4'>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Total Harga</Text>
                          <TextField.Root 
                            name='total_harga'
                            size={"3"}
                            value={formatRupiah(overviewData.total_harga)}
                            readOnly 
                          />
                        </Box>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Dibayarkan</Text>
                          <TextField.Root 
                            name='dibayarkan'
                            size={"3"}
                            type="number"
                            value={overviewData.dibayarkan}
                            onChange={(event) => handleOverview('dibayarkan', event)}
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
                            readOnly
                            value={formatRupiah(sisaBayar)}
                          />
                        </Box>
                        <Box>
                          <Text size={"2"} weight={"bold"}>Kembalian</Text>
                          <TextField.Root 
                            size={"3"} 
                            readOnly
                            value={formatRupiah(kembalian)}
                          />
                        </Box>
                      </Flex>
                      <Flex>
                        <Box width="250px">
                          <Text size={"2"} weight="bold">Catatan</Text>
                          <TextArea 
                            value={overviewData.catatan}
                            name='catatan' 
                            onChange={(event) => handleOverview('catatan', event)}
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
                <Card size="2">
                  <Flex gap="4" className='mb-4'>
                    <Box width="200px">
                      <Box>
                        <Text size="2" weight="bold">Jenis Pakaian</Text>
                      </Box>
                      <Select.Root 
                        value={String(transaksiDetailData.jenis_pakaian)} 
                        onValueChange={handleSelectJenisPakaian}
                        size={"3"}
                        name='jenis_pakaian'
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
                    {selectedJenisPakaianDetail &&(
                      <>
                        <Box width="200px">
                          <Text size="2" weight="bold">Satuan Pakaian</Text>
                          <TextField.Root 
                            className="w-full" 
                            size={"3"} 
                            value={selectedJenisPakaianDetail?.satuan || "-"} 
                            readOnly
                          />
                        </Box>
                        <Box width="200px">
                          <Text size="2" weight="bold">Harga / Kg</Text>
                          <TextField.Root 
                            className="w-full" 
                            size={"3"} 
                            value={selectedJenisPakaianDetail?.harga_per_kg || "-"} 
                            readOnly
                          />
                        </Box>
                        <Box width="200px">
                          <Text size="2" weight="bold">Harga / Item</Text>
                          <TextField.Root 
                            className="w-full" 
                            size={"3"} 
                            value={selectedJenisPakaianDetail?.harga_per_item || "-"} 
                            readOnly
                          />
                        </Box>
                      </>
                    )}
                  </Flex>
                  <Flex gap={"4"} className='mb-4'>
                    {selectedJenisPakaianDetail &&(
                      <>
                        <Box width="200px">
                          <Text size="2" weight="bold">Berat (kg)</Text>
                          <TextField.Root 
                            className="w-full"
                            value={transaksiDetailData.berat_kg ?? ''}
                            onChange={(event) => handleService('berat_kg', event)}
                            name='berat_kg'
                            size={"3"}
                          />
                        </Box>
                        <Box width="200px">
                          <Text size="2" weight="bold">Jumlah Item</Text>
                          <TextField.Root 
                            className="w-full" 
                            value={transaksiDetailData.jumlah_item}
                            onChange={(event) => handleService('jumlah_item', event)}
                            name='jumlah_item' 
                            size={"3"}
                          />
                        </Box>
                        <Box maxWidth="600px">
                          <Text size="2" weight="bold">Layanan Setrika</Text>
                          <RadioCards.Root
                            name="layanan_setrika"
                            value={transaksiDetailData.layanan_setrika ? "true" : "false"}
                            onValueChange={(value) => handleService('layanan_setrika', value)}
                            columns={{ initial: "1", sm: "1" }} 
                            size={"1"}
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
                      </>
                    )}
                  </Flex>
                  <Flex gap={"4"} className='mb-4'>
                    {selectedJenisPakaianDetail &&(
                      <>
                        <Box width="200px">
                          <Box>
                            <Text size="2" weight="bold">Mesin Cuci</Text>
                          </Box>
                          <Select.Root 
                            size={"3"}
                            name='mesin_cuci'
                            value={String(transaksiDetailData.mesin_cuci)}
                            onValueChange={(value) => handleService('mesin_cuci', value)}
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
                            value={acuanHarga}
                            onValueChange={setAcuanHarga}
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
                            value={transaksiDetailData.total_harga_layanan}
                            readOnly
                          />
                        </Box>
                      </>
                    )}
                  </Flex>
                  <Flex gap={"4"} className='mb-4'>
                    {selectedJenisPakaianDetail &&(
                      <>
                        <Box width="250px">
                          <Text size={"2"} weight="bold">Catatan Admin</Text>
                          <TextArea 
                            value={transaksiDetailData.catatan_admin}
                            name='catatan_admin' 
                            onChange={(event) => handleService('catatan_admin', event)}
                          />
                        </Box>
                        <Box width="250px">
                          <Text size={"2"} weight="bold">Catatan Pelanggan</Text>
                          <TextArea 
                            value={transaksiDetailData.catatan_pelanggan}
                            name='catatan_pelanggan' 
                            onChange={(event) => handleService('catatan_pelanggan', event)}
                          />
                        </Box>
                      </>
                    )}
                  </Flex>
                  <Button type='submit'>
                      Submit
                  </Button>
                </Card>
              </Box>
            </Tabs.Content>
          </form>
        </Box>
      </Tabs.Root>
    </div>
  )
}

export default CreateTransaksi
