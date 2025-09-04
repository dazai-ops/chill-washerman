//lib
import { Dialog, DataList, Badge, DropdownMenu } from '@radix-ui/themes'
import { EyeOpenIcon } from '@radix-ui/react-icons'

//utils
import { formatDate } from '@/utils/helpers/formatters/date'
import { Apparel } from '@/models/apparel.model'
import { formatRupiah } from '@/utils/helpers/formatters/rupiah'

const ApparelDetailDialog = ({data}: {data: Apparel}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          <EyeOpenIcon />Detail
        </DropdownMenu.Item>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="450px">
        <Dialog.Title>{data.jenis_pakaian}</Dialog.Title>
        <DropdownMenu.Separator />
        <Dialog.Description size="2" mb="4">
          Detail
        </Dialog.Description>

        <DataList.Root>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Satuan</DataList.Label>
            <DataList.Value>
              <Badge color="jade" variant="soft" radius="full">
                {data.satuan}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Harga/item</DataList.Label>
            <DataList.Value>{formatRupiah(data.harga_per_item)}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Harga/kg</DataList.Label>
            <DataList.Value>{formatRupiah(data.harga_per_kg)}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Estimasi Pengerjaan</DataList.Label>
            <DataList.Value>
              {data.estimasi_waktu} Menit
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Ditambahkan</DataList.Label>
            <DataList.Value>
              {formatDate(data.created_at || "-", "long")}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

      </Dialog.Content>
    </Dialog.Root>
  )
}

export default ApparelDetailDialog
