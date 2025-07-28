import React from 'react'
import { TabNav } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'

function Tabnav() {

  const pathName = usePathname()

  return (
    <TabNav.Root>
      <TabNav.Link href="/admin" active={pathName === '/admin'} >Admin</TabNav.Link>
      <TabNav.Link href="#" active={pathName === '/transaksi'}>Transaksi</TabNav.Link>
      <TabNav.Link href="#" active={pathName === '/histori'}>Histori</TabNav.Link>
      <TabNav.Link href="#" active={pathName === '/mesincuci'}>Mesin Cuci</TabNav.Link>
      <TabNav.Link href="#" active={pathName === '/jenispakaian'}>Jenis Pakaian</TabNav.Link>
    </TabNav.Root>
  )
}

export default Tabnav
