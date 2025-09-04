import { TabNav } from '@radix-ui/themes'
import { usePathname } from 'next/navigation'
import Profile from '@/components/layout/AdminProfile/AdminProfile';

const Tabnav = () => {

  const pathName = usePathname()
  
  return (
    <TabNav.Root size={{initial: '1', sm: '2'}} color="gray" highContrast>
      <Profile/>
      <TabNav.Link href="/admin" active={pathName === '/admin'} >Admin</TabNav.Link>
      <TabNav.Link href="/transaksi" active={pathName === '/transaksi'}>Transaksi</TabNav.Link>
      <TabNav.Link href="/rekapan" active={pathName === '/rekapan'}>Rekapan</TabNav.Link>
      <TabNav.Link href="/mesin-cuci" active={pathName === '/mesin-cuci'}>Mesin Cuci</TabNav.Link>
      <TabNav.Link href="/jenis-pakaian" active={pathName === '/jenis-pakaian'}>Jenis Pakaian</TabNav.Link>
      {/* <ThemeToggle/> */}
    </TabNav.Root>
  )
}

export default Tabnav
