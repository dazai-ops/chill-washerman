import React from 'react'
import { SegmentedControl } from '@radix-ui/themes'
import { TableIcon, ListBulletIcon } from '@radix-ui/react-icons'

interface SegmentedControlProps {
  segmented: string
  setSegmented: React.Dispatch<React.SetStateAction<string>>
}

function SegementedControl({segmented, setSegmented}: SegmentedControlProps) {
  return (
    <SegmentedControl.Root defaultValue="ink" size="3" onValueChange={setSegmented} value={segmented}>
      <SegmentedControl.Item value="table">
        <TableIcon width="20" height="20"/>
      </SegmentedControl.Item>
      <SegmentedControl.Item value="card">
        <ListBulletIcon width="20" height="20"/>
      </SegmentedControl.Item>
    </SegmentedControl.Root>
  )
}

export default SegementedControl
