import React from 'react'
import { DropdownMenu, Avatar } from '@radix-ui/themes'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import ConfirmLogout  from '@/components/dialog/ConfirmLogout/ConfirmLogout'

function Profile() {

  const admin = useSelector((state: RootState) => state.auth.user)

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Avatar
         className='mt-1 mr-2'
          size="2"
          src="/admin.png"
          radius="full"
          fallback="T"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>{admin?.nama}</DropdownMenu.Item>
        <DropdownMenu.Item>{admin?.role}</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <ConfirmLogout id={admin?.id}/>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default Profile
