import React from 'react'

interface ErrorMessageProps {
  message: string
  className?: string
}

function ErrorMessage({message, className}: ErrorMessageProps) {
  return (
    <p className={`text-red-500 text-sm ${className}`}>
      {message}
    </p>
  )
}

export default ErrorMessage
