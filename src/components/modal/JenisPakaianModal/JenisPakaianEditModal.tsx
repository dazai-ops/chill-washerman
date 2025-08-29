//lib
import { useEffect, useState } from 'react'
import { Button, Flex, AlertDialog, Grid, TextField, Text, DropdownMenu, Box } from '@radix-ui/themes'
import { Pencil1Icon } from '@radix-ui/react-icons';
import { toast } from 'sonner'

//redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { setErrors, clearErrors } from '@/redux/slices/form-validation/singleForm'
import { updateApparel } from '@/lib/thunk/jenispakaian/jenispakaianThunk'
import { setApparelForm } from '@/redux/slices/jenispakaianSlice';

//utils
import { Apparel } from '@/models/jenispakaian.model'
import { validateForm } from '@/utils/form-validation/validateForm'
import { FieldRules } from '@/utils/form-validation/singleFormValidation.model'

//components
import ErrorMessage from '@/components/ui/FieldError/ErrorMessage'
import ConfirmChange from '@/components/dialog/ConfirmChange/ConfirmChange';
import InputRupiah from '@/components/ui/InputRupiah/InputRupiah';

const rules: Record<string, FieldRules> = {
  jenis_pakaian: ['required'],
  satuan: ['required'],
  harga_per_item: ['required'],
  harga_per_kg: ['required'],
  estimasi_waktu: ['required'],
}

function JenisPakaianEditModal({data}: {data: Apparel}) {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const {apparelForm, status} = useSelector((state:RootState) => state.jenisPakaian)
  const {errors} = useSelector((state:RootState) => state.singleForm)

  useEffect(() => {
    if(data) {
      dispatch(clearErrors())
      dispatch(setApparelForm({
        jenis_pakaian: data.jenis_pakaian,
        harga_per_kg: data.harga_per_kg,
        harga_per_item: data.harga_per_item,
        satuan: data.satuan,
        estimasi_waktu: data.estimasi_waktu,
      }))
    }
  }, [data, dispatch])

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const {name, value} = e.target
      dispatch(setApparelForm({
        ...apparelForm, 
        [name]: value
      }))
    }
  
  const handleFormVerify = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(clearErrors())
    const formError = validateForm(apparelForm, rules)
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apparelForm])

  useEffect(() => {
    if(status === "success") {
      setOpen(false)
    }
  }, [status])

  // DEBUG ---------------
  useEffect(() => {
    console.log('apparelForm', apparelForm)
  }, [apparelForm])
  // DEBUG ---------------

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
                    onChange={handleFormChange} 
                    value={apparelForm.jenis_pakaian} 
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
                    onChange={handleFormChange} 
                    value={apparelForm.satuan}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('satuan') ?? ''} 
                  />
                </Box>
              </Flex>
              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <InputRupiah
                    label='Harga / (kg)'
                    name='harga_per_kg'
                    size='3'
                    labelSize='2'
                    value={String(apparelForm.harga_per_kg)}
                    className="mb-1"
                    onChange={(value) => dispatch(setApparelForm({...apparelForm, harga_per_kg: Number(value)}))}
                  />
                </Box>
                <Box className='w-full'>
                  <InputRupiah
                    label='Harga / (item)'
                    name='harga_per_item'
                    size='3'
                    labelSize='2'
                    value={String(apparelForm.harga_per_item)}
                    className="mb-1"
                    onChange={(value) => dispatch(setApparelForm({...apparelForm, harga_per_item: Number(value)}))}
                  />
                </Box>
              </Flex>
              <Text size="2" weight="bold">Estimasi Pengerjaan (menit)</Text>
              <TextField.Root 
                size="3" 
                type='number'
                className={`mb-1 ${getErrorMessage('estimasi_waktu') ? 'border border-red-500' : ''}`}
                name='estimasi_waktu' 
                onChange={handleFormChange} 
                value={String(apparelForm.estimasi_waktu)}
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
                onConfirm={() => dispatch(updateApparel({ id: String(data.id), payload: apparelForm }))} 
                customButton={
                  showConfirm ? (
                    <Button color='green'>Update</Button>
                  ) : (
                    <Button disabled={disabled} color='green' onClick={(e) => handleFormVerify(e)}>Verify</Button>
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