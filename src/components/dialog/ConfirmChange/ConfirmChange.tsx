import { PersonIcon } from '@radix-ui/react-icons'
import { AlertDialog, Button, Flex, DropdownMenu } from '@radix-ui/themes'

type ConfirmChangeProps = {
  onConfirm?: () => void
  label?: string
  customIcon?: React.ReactNode
  customButton?: React.ReactNode
  disabled?: boolean
  description?: string
}

const ConfirmChange = ({
    onConfirm,
    label = 'Update', 
    customButton, 
    customIcon, 
    description = 'Klik update untuk simpan perubahan'
  }: ConfirmChangeProps
) => {

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        {customButton 
          ? customButton 
          : <DropdownMenu.Item 
              color="blue" 
              onSelect={(e) => e.preventDefault()}
            >
              {customIcon ? customIcon : <PersonIcon />}{label}
            </DropdownMenu.Item>
        }
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
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button 
              variant="soft" 
              color="green" 
              onClick={onConfirm}
            >
              Update
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>

  )
}

export default ConfirmChange
