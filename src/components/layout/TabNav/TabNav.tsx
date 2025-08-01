import React from 'react'
import { TabNav } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import Profile from '@/components/layout/AdminProfile/AdminProfile';

function Tabnav() {

  const pathName = usePathname()
  
  return (
    <TabNav.Root size="2">
      <Profile/>
      <TabNav.Link href="/admin" active={pathName === '/admin'} >Admin</TabNav.Link>
      <TabNav.Link href="/transaksi" active={pathName === '/transaksi'}>Transaksi</TabNav.Link>
      <TabNav.Link href="#" active={pathName === '/histori'}>Histori</TabNav.Link>
      <TabNav.Link href="/mesin-cuci" active={pathName === '/mesin-cuci'}>Mesin Cuci</TabNav.Link>
      <TabNav.Link href="/jenis-pakaian" active={pathName === '/jenis-pakaian'}>Jenis Pakaian</TabNav.Link>
    </TabNav.Root>
  )
}

export default Tabnav
