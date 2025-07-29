import React from 'react'
import { Avatar, Box, Card, Flex, Text } from '@radix-ui/themes'

interface ProfileProps {
  id: string | null
  nama: string | null
  role: string | null
}
function Profile({data}: {data: ProfileProps}) {
  return (
    <Box maxWidth="240px" className='mt-2'>
      <Card>
        <Flex gap="3" align="center">
          <Avatar
            size="3"
            src="https://media.istockphoto.com/id/2220604143/id/vektor/flat-illustration-in-grayscale-avatar-user-profile-person-icon-gender-neutral-silhouette.jpg?s=612x612&w=0&k=20&c=Tl1AYJO-6C50uz5BG74vZYygE1mUOvwgMm93t3SOKq8="
            radius="full"
            fallback="T"
          />
          <Box>
            <Text as="div" size="2" weight="bold">
              {data?.nama}
            </Text>
            <Text as="div" size="2" color="gray">
              {data?.role === 'admin' ? 'Admin' : 'Superuser'}
            </Text>
          </Box>
        </Flex>
      </Card>
    </Box>

  )
}

export default Profile
