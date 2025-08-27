import TransaksiEditLayout from '@/components/features/Transaksi/EditTransaksi/layout'

async function TransaksiEditPage({
  params
}: {
  params: Promise<{id: number}>
}) {
  const selectedId = (await params).id
  return (
    <TransaksiEditLayout id={selectedId}/>
  )
}

export default TransaksiEditPage
