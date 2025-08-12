//lib
import { useEffect, useState } from 'react'
import { Button, Flex, AlertDialog, Grid, TextField, Text, DropdownMenu, Box } from '@radix-ui/themes'
import { Pencil1Icon } from '@radix-ui/react-icons';
import { toast } from 'sonner'

//redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { clearForm, setErrors, setForm, clearErrors } from '@/redux/slices/form-validation/singleForm'
import { updateJenisPakaian } from '@/lib/thunk/jenispakaian/jenispakaianThunk'

//utils
import { JenisPakaian } from '@/models/jenispakaian.model'
import { validateForm } from '@/utils/form-validation/validateForm'
import { FieldRules } from '@/utils/form-validation/singleFormValidation.model'

//components
import ErrorMessage from '@/components/ui/FieldError/ErrorMessage'
import ConfirmChange from '@/components/dialog/ConfirmChange/ConfirmChange';

const rules: Record<string, FieldRules> = {
  jenis_pakaian: ['required'],
  satuan: ['required'],
  harga_per_item: ['required'],
  harga_per_kg: ['required'],
  estimasi_waktu: ['required'],
}

function JenisPakaianEditModal({data}: {data: JenisPakaian}) {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const formData = useSelector((state:RootState) => state.singleForm.data)
  const errors = useSelector((state:RootState) => state.singleForm.errors)
  const res = useSelector((state:RootState) => state.jenisPakaian.success)

  useEffect(() => {
    if(data) {
      dispatch(clearForm())
      dispatch(clearErrors())
      dispatch(setForm({
        jenis_pakaian: data.jenis_pakaian,
        harga_per_kg: data.harga_per_kg,
        harga_per_item: data.harga_per_item,
        satuan: data.satuan,
        estimasi_waktu: data.estimasi_waktu,
      }))
    }
  }, [data, dispatch])

  const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const {name, value} = e.target
      dispatch(setForm({...formData, [name]: value}))
    }
  
  const formSubmit = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(clearErrors())
    const formError = validateForm(formData, rules)
    if(formError.length > 0) {
      dispatch(setErrors(formError))
      setDisabled(true)
      setShowConfirm(false)
    } else {
      setShowConfirm(true)
      toast.success('Data has verified', {
        description: 'Clik update to save changes',
        position: "top-center"
      })
    }  
  }

  const getErrorMessage = (fieldName: string) => {
    return errors.find((err) => err.field === fieldName)?.message
  }

  useEffect(() => {
    if(!open) {
      dispatch(clearErrors())
    }
  }, [open, dispatch])

  useEffect(() => {
    setDisabled(false)
    if(showConfirm){
      setShowConfirm(false)
    }
  }, [formData])

  useEffect(() => {
    console.log(res)
    if(res === "ok") {
      setOpen(false)
    }
  }, [res])

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger>
        <DropdownMenu.Item onClick={() => setOpen(true)} color='yellow' onSelect={(e) => e.preventDefault()}>
          <Pencil1Icon />Edit
        </DropdownMenu.Item>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="500px">
        <AlertDialog.Title>Edit Jenis Pakaian</AlertDialog.Title>
        <AlertDialog.Description >
          Ubah data yang diperlukan
        </AlertDialog.Description>
        <form>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Nama</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('jenis_pakaian') ? 'border border-red-500' : ''}`}
                    name='jenis_pakaian' 
                    onChange={formChange} 
                    defaultValue={data?.jenis_pakaian} 
                  />
                  <ErrorMessage 
                    message={getErrorMessage('jenis_pakaian') ?? ''} 
                  />
                </Box>
                <Box className='w-full'>
                  <Text size="2" weight="bold">Satuan</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('satuan') ? 'border border-red-500' : ''}`}
                    name='satuan' 
                    onChange={formChange} 
                    defaultValue={data?.satuan}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('satuan') ?? ''} 
                  />
                </Box>
              </Flex>
              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Harga / (kg)</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('harga_per_kg') ? 'border border-red-500' : ''}`}
                    name='harga_per_kg' 
                    onChange={formChange} 
                    defaultValue={String(data?.harga_per_kg)}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('harga_per_kg') ?? ''} 
                  />
                </Box>
                <Box className='w-full'>
                  <Text size="2" weight="bold">Harga / (item)</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('harga_per_item') ? 'border border-red-500' : ''}`}
                    name='harga_per_item' 
                    onChange={formChange} 
                    defaultValue={String(data?.harga_per_item)}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('harga_per_item') ?? ''} 
                  />
                </Box>
              </Flex>
              <Text size="2" weight="bold">Estimasi Waktu</Text>
              <TextField.Root 
                size="3" 
                type='number'
                className={`mb-1 ${getErrorMessage('estimasi_waktu') ? 'border border-red-500' : ''}`}
                name='estimasi_waktu' 
                onChange={formChange} 
                defaultValue={String(data?.estimasi_waktu)}
              />
              <ErrorMessage 
                message={getErrorMessage('estimasi_waktu') ?? ''} 
              />
            </Grid>
          </Flex>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button color='gray' onClick={() => setOpen(false)}>
                Batal
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <ConfirmChange
                onConfirm={() => dispatch(updateJenisPakaian({ id: String(data.id), payload: formData }))} 
                customButton={
                  showConfirm ? (
                    <Button color='green'>Update</Button>
                  ) : (
                    <Button disabled={disabled} color='green' onClick={(e) => formSubmit(e)}>Verify</Button>
                  )
                }
              />
            </AlertDialog.Action>
          </Flex>
        </form>

      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default JenisPakaianEditModal