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
         className='mt-1'
          size="2"
          src="https://media.istockphoto.com/id/2220604143/id/vektor/flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette.jpg?s=612x612&w=0&k=20&c=Tl1AYJO-6C50uz5BG74vZYygE1mUOvwgMm93t3SOKq8="
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
