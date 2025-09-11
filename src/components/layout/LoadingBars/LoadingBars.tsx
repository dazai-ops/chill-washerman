import React from 'react'
import { Spinner as ShadcnSpinner } from '@/components/ui/shadcn-io/spinner'

function LoadingBars() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 opacity-50">
      <ShadcnSpinner variant="bars" className="text-black" />
    </div>
  )
}

export default LoadingBars
