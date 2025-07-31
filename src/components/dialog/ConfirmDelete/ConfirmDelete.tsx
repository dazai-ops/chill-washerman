import { TrashIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Flex, DropdownMenu } from '@radix-ui/themes'

type ConfirmDeleteProps = {
  onConfirm: () => void
  label?: string
}

function ConfirmDelete({onConfirm, label = 'Delete'}: ConfirmDeleteProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <DropdownMenu.Item 
          color="red" 
          onSelect={(e) => e.preventDefault()}
        >
          <TrashIcon />Delete
        </DropdownMenu.Item>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{label}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This action cannot be undone
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={onConfirm}>
              Confirm
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>

  )
}

export default ConfirmDelete
