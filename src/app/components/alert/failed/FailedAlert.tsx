import React from 'react'
import { Callout } from '@radix-ui/themes'
import { InfoCircledIcon } from '@radix-ui/react-icons'

interface FailedAlertProps {
  message: string
  className?: string
}

function FailedAlert({message, className}: FailedAlertProps) {
  return (
    <Callout.Root className='mb-[-25px] mt-3' color='red'>
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Callout.Text>
        {message}
      </Callout.Text>
    </Callout.Root>
  )
}

export default FailedAlert
