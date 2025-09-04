//lib
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { Dialog, DataList, Badge, DropdownMenu } from '@radix-ui/themes'

//utils
import { Admin } from '@/models/admin.model';
import { formatDate } from '@/utils/helpers/formatters/date'
import { formatToTitleCase } from '@/utils/helpers/formatters/titleCase';

const AdminDetailDialog = ({data}: {data: Admin}) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
          <EyeOpenIcon />Detail
        </DropdownMenu.Item>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="550px">
        <Dialog.Title>{data.nama}</Dialog.Title>
        <DropdownMenu.Separator />
        
        <Dialog.Description size="2" mb="4">
          Detail
        </Dialog.Description>

        <DataList.Root>
          <DataList.Item align="center">
            <DataList.Label minWidth="88px">Role</DataList.Label>
            <DataList.Value>
              <Badge color={data.role === 'admin' ? 'pink' : 'sky'} variant="soft" radius="full">
                {formatToTitleCase(data.role)}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">No Telepon</DataList.Label>
            <DataList.Value>{data.no_telepon}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Username</DataList.Label>
            <DataList.Value>{data.username}</DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Last Login</DataList.Label>
            <DataList.Value>
              {data.is_login ? (
                <Badge color="jade" variant="soft">Sedang Online</Badge>
              ) : data.last_login == null ?(
                <Badge color="red" variant="soft">Belum login / Baru Ditambahkan</Badge>
              ) : (
                <Badge color="yellow" variant="soft">{data.last_login && formatDate(data.last_login, "long")}</Badge>
              )}
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Jumlah Input</DataList.Label>
            <DataList.Value>
              <Badge color="blue" variant="soft" radius="full">
                {data.jumlah_input || 0}
              </Badge>
            </DataList.Value>
          </DataList.Item>
          <DataList.Item>
            <DataList.Label minWidth="88px">Alamat Rumah</DataList.Label>
            <DataList.Value>
              {data.alamat_rumah}
            </DataList.Value>
          </DataList.Item>
        </DataList.Root>

      </Dialog.Content>
    </Dialog.Root>
  )
}

export default AdminDetailDialog
