import TransaksiEditLayout from '@/components/features/Transaction/TransactionEditLayout/layout'

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
