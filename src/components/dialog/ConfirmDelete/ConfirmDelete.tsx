import { TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Flex, DropdownMenu } from '@radix-ui/themes'

type ConfirmDeleteProps = {
  onConfirm: () => void
  label?: string
  description?: string
}

const ConfirmDelete = ({
    onConfirm, 
    label = 'Hapus', 
    description = 'Data yang dihapus tidak dapat dikembalikan!'
  }: ConfirmDeleteProps
) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <DropdownMenu.Item 
          color="red" 
          onSelect={(e) => e.preventDefault()}
        >
          <TrashIcon />Hapus
        </DropdownMenu.Item>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{label}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          {description}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button 
              variant="soft" 
              color="gray"
            >
              Batal
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button 
              variant="soft" 
              color="red" 
              onClick={onConfirm}
            >
              Hapus
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>

  )
}

export default ConfirmDelete
