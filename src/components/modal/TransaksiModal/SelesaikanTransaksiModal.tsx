import React, { use, useEffect, useState } from 'react'
import { Button, Flex, AlertDialog, Link, DataList, Badge, Text, DropdownMenu } from '@radix-ui/themes'
import { formatRupiah } from '@/utils/rupiahFormatter'
import { updatePaymentStatus } from '@/lib/thunk/transaksi/transaksiThunk'
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store'

function SelesaikanTransaksiModal({data}) {
  const dispatch = useDispatch<AppDispatch>()
  const admin = useSelector((state: RootState) => state.auth.user)
  const {status} = useSelector((state: RootState) => state.transaksi)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if(status === 'success') setOpen(false)
  },[status])

  const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch(updatePaymentStatus({
      id: data.id,
      payload: {
        status_proses: 'selesai',
        updated_by: admin!.id
      }
    }))
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Trigger>
        <Button 
          color="green" 
          variant='soft' 
          size={'2'}
          onSelect={(e) => e.preventDefault()}
          onClick={() => setOpen(true)}
        >
          Selesaikan Transaksi
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>
          <>
            <Flex justify={'between'}>
              {data.kode_transaksi}
              <Text>
                <Badge>
                  {data.status_pembayaran}
                </Badge>
              </Text>
            </Flex>
          </>
        </AlertDialog.Title>
        
        <DropdownMenu.Separator />

        <AlertDialog.Description size="2">
          {data.status_proses === 'siap_diambil' && data.status_pembayaran === 'lunas'
            ? ''
            : data.status_proses === 'siap_diambil' && data.status_pembayaran === 'belum_lunas'
            ? "Pembayaran Belum Lunas!"
            : "Transaksi Belum Siap Diambil!"
          }
        </AlertDialog.Description>
        {data.status_proses === 'siap_diambil' && data.status_pembayaran === 'lunas' && (
          <DataList.Root>
            <DataList.Item>
              <DataList.Label minWidth="88px">Pelanggan</DataList.Label>
              <DataList.Value>{data.nama_pelanggan}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">Total Harga</DataList.Label>
              <DataList.Value>{formatRupiah(data.total_harga)}</DataList.Value>
            </DataList.Item>
            <DataList.Item>
              <DataList.Label minWidth="88px">Dibayarkan</DataList.Label>
              <DataList.Value>{formatRupiah(data.dibayarkan)}</DataList.Value>
            </DataList.Item>
          </DataList.Root>
        )}

        <Flex gap="3" mt="4" justify="end">
          {data.status_proses === 'siap_diambil' && data.status_pembayaran === 'lunas' 
            ? (
              <>
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray" onClick={() => setOpen(false)}>
                    Batal
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                  <Button variant="soft" color="green" 
                    onClick={(e) => handleSubmit(e)}>
                    Selesaikan
                  </Button>
                </AlertDialog.Action>
              </>
            )
            : data.status_proses === 'siap_diambil' && data.status_pembayaran === 'belum_lunas'
            ? (
              <>
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray" onClick={() => setOpen(false)}>
                    Batal
                  </Button>
                </AlertDialog.Cancel>
                <Link 
                  href={`/transaksi/edit/${data.id}`} 
                  target='_blank' 
                  className='mb-3'
                >
                  <Button color="green" variant='soft' size={"2"} >
                    Update Pembayaran
                  </Button>
                </Link>
              </>
            )
            : (
              <>
                <AlertDialog.Cancel>
                  <Button variant="soft" color="gray" onClick={() => setOpen(false)}>
                    Batal
                  </Button>
                </AlertDialog.Cancel>
              </>
            )
          }
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>

  )
}

export default SelesaikanTransaksiModal
