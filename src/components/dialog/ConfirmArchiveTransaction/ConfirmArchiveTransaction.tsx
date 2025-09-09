import { ArchiveIcon, TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Flex, DropdownMenu } from '@radix-ui/themes'

type ConfirmArchiveTransaction = {
  onConfirm: () => void
  label?: string
  description?: string
  buttonLabel?: string
}

const ConfirmArchiveTransaction = ({
    onConfirm, 
    label = 'Batalkan', 
    description = 'Data yang dibatalkan dapat dikembalikan!',
    buttonLabel = 'Batalkan'
  }: ConfirmArchiveTransaction
) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <DropdownMenu.Item 
          color="yellow" 
          onSelect={(e) => e.preventDefault()}
        >
          <ArchiveIcon />{buttonLabel}
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
              color="green" 
              onClick={onConfirm}
            >
              Konfirmasi
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>

  )
}

export default ConfirmArchiveTransaction
