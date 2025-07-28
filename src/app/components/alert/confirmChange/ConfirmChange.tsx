import { PersonIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Flex, DropdownMenu } from '@radix-ui/themes'

type ConfirmChangeProps = {
  onConfirm: () => void
  label?: string
  customButton?: React.ReactNode
}

function ConfirmChange({onConfirm, label = 'Update', customButton}: ConfirmChangeProps) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        {customButton 
          ? customButton 
          : <DropdownMenu.Item 
              color="blue" onSelect={(e) => e.preventDefault()}
            >
              <PersonIcon />{label}
            </DropdownMenu.Item>
        }
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>{label}</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? Click update to confirm
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={onConfirm}>
              Update
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>

  )
}

export default ConfirmChange
