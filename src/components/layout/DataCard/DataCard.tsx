'use client'

import { JSX, useState } from 'react'
import {
  Flex,
  Text,
  TextField,
  IconButton,
} from '@radix-ui/themes'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'

type DataCardProps<T> = {
  data: T[]
  renderCard: (row: T) => JSX.Element
  renderToolbar?: React.ReactNode
  itemsPerPage?: number
}

export function DataCard<T>({
  data,
  renderCard,
  renderToolbar,
  itemsPerPage = 12,
}: DataCardProps<T>) {
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredData = data.filter((item) => {
    const values = Object.values(item as Record<string, unknown>)
    .map((value) => String(value))
    .join(' ').toLowerCase()
    return values.includes(search.toLowerCase())
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <div className="w-full">
      <div className="flex sm:gap-2 gap-1 mb-4">
        <TextField.Root
          size={{initial: '2', sm: '3'}}
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1) // reset ke halaman pertama saat mencari
          }}
          className="w-full"
        />
        {renderToolbar}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
        {currentData.map((item, index) => (
          <div key={index}>{renderCard(item)}</div>
        ))}
        {currentData.length === 0 && (
          <Text size="2" color="gray">
            No results found.
          </Text>
        )}
      </div>

      {totalPages > 1 && (
        <Flex justify="center" align="center" gap="3">
          <IconButton
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            color="gray"
            variant="soft"
          >
            <ChevronLeftIcon />
          </IconButton>

          <Text className='text-sm'>
            Page {currentPage} of {totalPages}
          </Text>

          <IconButton
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            color="gray"
            variant="soft"
          >
            <ChevronRightIcon />
          </IconButton>
        </Flex>
      )}
    </div>
  )
}
