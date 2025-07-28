import React from 'react'
import { Callout } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'

interface SucceedAlertProps {
  message: string
  className?: string
}

function SucceedAlert({message, className}: SucceedAlertProps) {
  return (
    <Callout.Root className='mb-[-28px] mt-3' color='green'>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        {message}
      </Callout.Text>
    </Callout.Root>
  )
}

export default SucceedAlert
