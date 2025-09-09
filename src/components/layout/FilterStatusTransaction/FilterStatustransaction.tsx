import { getTransaction } from "@/lib/thunk/transaction/transactionThunk"
import { AppDispatch } from "@/redux/store"
import { DropdownMenu, Button } from "@radix-ui/themes"
import { useDispatch } from "react-redux"

const FilterStatusTransaction = () => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="soft" color="gray" highContrast size={"3"}>
          Opsi Status
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item color="orange" onClick={() => dispatch(getTransaction({status_proses: 'menunggu'}))}>Antrian</DropdownMenu.Item>
        <DropdownMenu.Item color="green" onClick={() => dispatch(getTransaction({status_proses: 'selesai'}))}>Selesai</DropdownMenu.Item>
        <DropdownMenu.Item color="iris" onClick={() => dispatch(getTransaction({status_proses: 'diproses'}))}>Diproses</DropdownMenu.Item>
        <DropdownMenu.Item color="red" onClick={() => dispatch(getTransaction({is_archive: true}))}>Dibatalkan</DropdownMenu.Item>
        <DropdownMenu.Item color="gray" onClick={() => dispatch(getTransaction())}>Tampilkan Semua</DropdownMenu.Item>
        <DropdownMenu.Separator />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default FilterStatusTransaction
