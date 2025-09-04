import React from 'react'
import { SegmentedControl } from '@radix-ui/themes'
import { TableIcon, ListBulletIcon } from '@radix-ui/react-icons'

interface SegmentedControlProps {
  segmented: string
  setSegmented: React.Dispatch<React.SetStateAction<string>>
}

function SegementedControl({segmented, setSegmented}: SegmentedControlProps) {
  return (
    <SegmentedControl.Root defaultValue="ink" size={{initial: '2', sm: '3'}} onValueChange={setSegmented} value={segmented}>
      <SegmentedControl.Item value="table">
        <TableIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"/>
      </SegmentedControl.Item>
      <SegmentedControl.Item value="card">
        <ListBulletIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6"/>
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}

export default SegementedControl
