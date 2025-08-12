//lib
import { useEffect, useState } from 'react'
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button, Flex, AlertDialog, Grid, TextField, Text, Box, RadioCards, DropdownMenu } from '@radix-ui/themes'
import { toast } from 'sonner'

//redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { updateMesinCuci } from '@/lib/thunk/mesincuci/mesincuciThunk'

//utils
import { validateForm } from '@/utils/form-validation/validateForm'
import { FieldRules } from '@/utils/form-validation/singleFormValidation.model'
import { MesinCuci } from '@/models/mesincuci.model'
import { clearForm, setErrors, setForm, clearErrors } from '@/redux/slices/form-validation/singleForm'

//components
import ConfirmChange from '@/components/dialog/ConfirmChange/ConfirmChange';
import ErrorMessage from '@/components/ui/FieldError/ErrorMessage'

const rules: Record<string, FieldRules> = {
  nama: ['required'],
  merk: ['required'],
  seri: ['required'],
  tahun_pembuatan: ['required'],
  tanggal_dibeli: ['required'],
  is_active: ['required'],
}

function MesinCuciEditModal({data}: {data: MesinCuci}) {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const formData = useSelector((state:RootState) => state.singleForm.data)
  const errors = useSelector((state:RootState) => state.singleForm.errors)
  const res = useSelector((state:RootState) => state.mesinCuci.success)

  useEffect(() => {
    if(data) {
      dispatch(clearForm())
      dispatch(clearErrors())
      dispatch(setForm({
        nama: data.nama,
        merk: data.merk,
        seri: data.seri,
        tahun_pembuatan: data.tahun_pembuatan,
        tanggal_dibeli: data.tanggal_dibeli,
        is_active: data.is_active
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
    if(res === "ok") {
      setOpen(false)
    }
  }, [res])

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger>
        <DropdownMenu.Item color='yellow' onClick={() => setOpen(true)} onSelect={(e) => e.preventDefault()}>
          <Pencil1Icon />Edit
        </DropdownMenu.Item>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="500px">
        <AlertDialog.Title>Edit Mesin Cuci</AlertDialog.Title>
        <AlertDialog.Description >
          Ubah data yang diperlukan
        </AlertDialog.Description>
        <form>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Box className='w-full'>
                <Text size="2" weight="bold">Nama</Text>
                <TextField.Root 
                  size="3" 
                  className='mb-1' 
                  name='nama' 
                  onChange={formChange} 
                  defaultValue={data?.nama}
                />
                <ErrorMessage 
                  message={getErrorMessage('nama') ?? ''}
                />
              </Box>
              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Merek</Text>
                  <TextField.Root 
                    size="3" 
                    className='mb-1' 
                    name='merk' 
                    onChange={formChange} 
                    defaultValue={data?.merk}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('merk') ?? ''}
                  />
                </Box>
                <Box className='w-full'>
                  <Text size="2" weight="bold">Seri</Text>
                  <TextField.Root 
                    size="3" 
                    className='mb-1' 
                    name='seri' 
                    onChange={formChange} 
                    defaultValue={data?.seri}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('seri') ?? ''}
                  />
                </Box>
              </Flex>
              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Tahun Pembuatan</Text>
                  <TextField.Root 
                    size="3" type='number' min="1991" max="2030" 
                    className='mb-1' 
                    name='tahun_pembuatan' 
                    onChange={formChange} 
                    defaultValue={data?.tahun_pembuatan}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('tahun_pembuatan') ?? ''}
                  />
                </Box>
                <Box className='w-full'>
                  <Text size="2" weight="bold">Tanggal Dibeli</Text>
                  <TextField.Root 
                    size="3" type='date' 
                    className='mb-1' 
                    name='tanggal_dibeli' 
                    onChange={formChange} 
                    defaultValue={data?.tanggal_dibeli}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('tanggal_dibeli') ?? ''}
                  />
                </Box>
              </Flex>
              <Text size="2" weight="bold">Status</Text>
              <Box maxWidth="600px">
                <RadioCards.Root 
                  name='is_active' 
                  onChange={formChange} 
                  defaultValue={data?.is_active.toString()} 
                  columns={{ initial: "1", sm: "3" }}
                >
                  <RadioCards.Item value="true">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Active</Text>
                    </Flex>
                  </RadioCards.Item>
                  <RadioCards.Item value="false">
                    <Flex direction="column" width="100%">
                      <Text weight="bold">Inactive</Text>
                    </Flex>
                  </RadioCards.Item>
                </RadioCards.Root>
                <ErrorMessage 
                  message={getErrorMessage('is_active') ?? ''}
                />
              </Box>
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
                onConfirm={() => dispatch(updateMesinCuci({ id: String(data.id), mesinCuci: formData }))} 
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

export default MesinCuciEditModal