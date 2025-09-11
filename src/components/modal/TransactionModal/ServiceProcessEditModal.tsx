import { useState, useEffect } from 'react'
import { AlertDialog, Button, Flex, Box, Text, Select } from '@radix-ui/themes'
import { Pencil1Icon } from '@radix-ui/react-icons'
import { TransactionDetail } from '@/models/transaction.model'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { getWasher } from '@/lib/thunk/washer/washerThunk'
import { clearErrors, setErrors } from '@/redux/slices/form-validation/singleForm'
import { validateForm } from '@/utils/form-validation/validateForm'
import { FieldRules } from '@/utils/form-validation/validation.model'
import ErrorMessage from '@/components/ui/FieldError/ErrorMessage'
import { updateDetailTransactionStatus } from '@/lib/thunk/transaction/transactionThunk'
import { clearStatus } from '@/redux/slices/transactionSlice'

const rules: Record<string, FieldRules> = {
  status_proses: ['required'],
  mesin_cuci: ['required'],
}

interface ServiceProcessEditModalProps {
  data: TransactionDetail
}

const ServiceProcessEditModal = ({data}: ServiceProcessEditModalProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [open, setOpen] = useState(false)
  const admin = useSelector((state: RootState) => state.auth.user)
  const {washerList} = useSelector((state: RootState) => state.washer)
  const {errors} = useSelector((state:RootState) => state.validateSingleForm)
  const {status} = useSelector((state:RootState) => state.transaksi)

  const [form, setForm] = useState({
    id: "",
    status_proses: "",
    mesin_cuci: "",
    updated_by: ""
  })
  useEffect(() => {
    dispatch(getWasher({is_active: 'true'}))
  },[data])

  useEffect(() => {
    if(!open){
      dispatch(clearErrors())
    }
  },[open])

  useEffect(() => {
    if(data && admin) {
      setForm({
        id: data.id ? data.id.toString() : '',
        status_proses: data.status_proses ?? '',
        mesin_cuci: data.mesin_cuci?.id ? data.mesin_cuci!.id.toString() : '',
        updated_by: admin.id.toString()
      })
    }
  },[data])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    dispatch(clearErrors())
    const formError = validateForm(form, rules)
    if(formError.length > 0) {
      dispatch(setErrors(formError))
    }else{
      dispatch(clearErrors())
      dispatch(updateDetailTransactionStatus({
        id: Number(form.id),
        payload: form
      }))
    }
  }

  const getErrorMessage = (fieldName: string) => {
    return errors.find((err) => err.field === fieldName)?.message
  }

  useEffect(() => {
    if(status === 'success') {
      // toast.success('Proses Layanan Berhasil Diubah')
      setOpen(false)
      dispatch(clearStatus())
    }
  },[status])

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger>
        <Button 
          onClick={() => setOpen(true)}
          onSelect={(e) => e.preventDefault()}  
          color="yellow" 
          size={'1'} 
          variant='soft'
        >
          <Pencil1Icon fontSize={20}/>
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Ubah Proses Layanan</AlertDialog.Title>
        <AlertDialog.Description size="2">
          <>
  
          </>
        </AlertDialog.Description>
        
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <Box className='flex flex-row w-full mt-3'>
            <Box className='w-full'>
              <Text size="2" weight="bold">Proses</Text>
            </Box>
            <Select.Root 
            
              size="3" 
              name='status_proses'
              defaultValue={form.status_proses}
              onValueChange={(e) => setForm({...form, status_proses: e})}
            >
              <Select.Trigger 
                style={{ width: '100%'}}
              />
                <Select.Content >
                  <Select.Group >
                    <Select.Label>Pilih proses</Select.Label>
                    <Select.Separator />
                    <Select.Item value="menunggu">Menunggu</Select.Item>
                    <Select.Item value="dicuci">Dicuci</Select.Item>
                    <Select.Item value="dikeringkan">Dikeringkan</Select.Item>
                    {data?.layanan_setrika && (
                      <Select.Item value="disetrika">Disetrika</Select.Item>
                    )}
                    <Select.Item value="selesai">Selesai</Select.Item>
                  </Select.Group>
                </Select.Content>
            </Select.Root>
            <ErrorMessage message={getErrorMessage('status_proses') ?? ''}/>
          </Box>
          <Box className='flex flex-row w-full mt-2'>
            <Box className='w-full'>
              <Text size="2" weight="bold">Mesin Cuci</Text>
            </Box>
            <Select.Root 
              size="3" 
              name='mesin_cuci'
              defaultValue={form.mesin_cuci}
              onValueChange={(e) => setForm({...form, mesin_cuci: e})}
            >
              <Select.Trigger 
                style={{ width: '100%'}}
                className={`mb-1 ${getErrorMessage('mesin_cuci') ? 'border border-red-500' : ''}`}
              />
                <Select.Content>
                  <Select.Group>
                    <Select.Label>Pilih mesin cuci</Select.Label>
                    <Select.Separator />
                    {washerList.length > 0 ? (
                      washerList.map((item) => (
                        <Select.Item 
                          key={item.id} 
                          value={item.id.toString()}
                        >{item.nama}</Select.Item>
                      ))
                    ) : (
                      <Select.Item value="tidak ada">Tidak ada mesin cuci</Select.Item>
                    )}
                  </Select.Group>
                </Select.Content>
            </Select.Root>
            <ErrorMessage message={getErrorMessage('mesin_cuci') ?? ''}/>
          </Box>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button type='button' onClick={() => setOpen(false)} variant="soft" color="gray">
                Batal
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button type="submit" variant="soft" color="green">
                Simpan
              </Button>
            </AlertDialog.Action>
          </Flex>
        </form>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default ServiceProcessEditModal