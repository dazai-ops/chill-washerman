//lib
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { Dialog, Badge, DropdownMenu, Table, Spinner, Callout } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'

//utils
import { formatToTitleCase } from '@/utils/helpers/formatters/titleCase'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getTrackingService } from '@/lib/thunk/washer/washerThunk'


interface WasherTrackingServiceDialogProps {
  id: number
  nama: string
}

const WasherTrackingServiceDialog = ({id, nama}: WasherTrackingServiceDialogProps) => {

  const dispatch = useDispatch<AppDispatch>()
  const {serviceTrackingList, loadingTracking} = useSelector((state: RootState) => state.washer)

  console.log(serviceTrackingList, 'from dialog')

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <DropdownMenu.Item color='indigo' onSelect={(e) => e.preventDefault()} onClick={() => dispatch(getTrackingService(id))}>
          <EyeOpenIcon />Tracking Service
        </DropdownMenu.Item>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="700px">
        <Dialog.Title>{nama}</Dialog.Title>
        <DropdownMenu.Separator />
        <Dialog.Description size="2" mb="4">
          Tracking service mesin cuci: {nama}
        </Dialog.Description>

        {loadingTracking ? (
          <Spinner/>
        ) : (
          <>
            {serviceTrackingList.length === 0 ? (
              <Callout.Root>
                <Callout.Icon>
                  <InfoCircledIcon />
                </Callout.Icon>
                <Callout.Text>
                  Tidak ada data...
                </Callout.Text>
              </Callout.Root>
            ) : (
              <Table.Root>
                <Table.Header>
                  <Table.Row>
                    <Table.ColumnHeaderCell align='center'>Kode Transaksi</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align='center'>Jenis Pakaian</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align='center'>Berat (kg)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align='center'>Jumlah (item)</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align='center'>Status</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>

                {serviceTrackingList.map((item, index) => (
                  <Table.Body  key={index}>
                      <Table.Row>
                        <Table.RowHeaderCell align='center'>
                          {(item!.transaksi_parent?.kode_transaksi)}
                        </Table.RowHeaderCell>
                        <Table.RowHeaderCell align='center'>{item!.jenis_pakaian.jenis_pakaian}</Table.RowHeaderCell>
                        <Table.Cell align='center'>{item!.berat_kg}</Table.Cell>
                        <Table.Cell align='center'>{item!.jumlah_item}</Table.Cell>
                        <Table.Cell align='center'>
                          {item!.status_proses === 'menunggu' ? (
                            <Badge color="orange" variant="soft">Menunggu</Badge>
                          ) : item!.status_proses === 'selesai' ? (
                            <Badge color="green" variant="soft">Selesai</Badge>
                          ) : item!.status_proses === 'pending' ? (
                            <Badge color="red" variant="soft">Pending</Badge>
                          ) : (
                            <Badge color="iris" variant="soft">
                              {formatToTitleCase(item!.status_proses || '')}
                            </Badge>
                          )
                        }
                        </Table.Cell>
                      </Table.Row>
                  </Table.Body>
                ))}
              </Table.Root>
            )}
          </>
        )}


        {/* <DataList.Root>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Merk</DataList.Label>
            <DataList.Value>
              <Badge color="jade" variant="soft" radius="full">
                {data.merk}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Seri</DataList.Label>
            <DataList.Value>{data.seri}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Total Digunakan</DataList.Label>
            <DataList.Value>{data.jumlah_digunakan || 0}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Status</DataList.Label>
            <DataList.Value>
              {data.status_mesin === 'tidak_digunakan' ? 'Tidak Digunakan' 
                : data.status_mesin === 'digunakan' ? 'Digunakan' 
                : 'Diperbaiki'
              }
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Status Aktif</DataList.Label>
            <DataList.Value>
              {data.is_active === true ? 'Active' : 'Inactive'}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

        <DropdownMenu.Separator />

        <DataList.Root>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tahun Pembuatan</DataList.Label>
            <DataList.Value>
              {data.tahun_pembuatan}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tanggal Dibeli</DataList.Label>
            <DataList.Value>
              {formatDate(data.tanggal_dibeli || '', "short")}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Tanggal Ditambahkan</DataList.Label>
            <DataList.Value>
              {formatDate(data.created_at || '', "long")}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Terakhir Digunakan</DataList.Label>
            <DataList.Value>
              {data.status_mesin === 'digunakan' ? 'Sedang Digunakan' 
              : data.terakhir_digunakan === null ? 'Belum Digunakan' 
              : formatDate(data.terakhir_digunakan, "long")}
            </DataList.Value>
          </DataList.Item>

        </DataList.Root> */}
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default WasherTrackingServiceDialog
