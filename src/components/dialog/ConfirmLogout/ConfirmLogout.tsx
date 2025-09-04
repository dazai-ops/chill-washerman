import { logoutAdmin } from '@/lib/thunk/auth/authThunk'
import { AppDispatch } from '@/redux/store'
import { TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Flex } from '@radix-ui/themes'
import { Admin } from '@/models/admin.model'
import { useDispatch } from 'react-redux'

const ConfirmLogout = ({id} : Admin) => {
  const dispatch = useDispatch<AppDispatch>()
  
  const handleLogout = () => {
    dispatch(logoutAdmin({
      id: id
    }))
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button 
          color="red"
          onSelect={(e) => e.preventDefault()}
        >
          <TrashIcon />Logout
        </Button>        
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Konfirmasi Logout</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Anda harus login kembali, apakah anda yakin?
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Batal
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button 
              variant="soft" 
              color="red" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>

  )
}

export default ConfirmLogout
