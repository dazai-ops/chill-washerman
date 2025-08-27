//lib
import { useEffect, useState } from 'react'
import { Pencil1Icon } from '@radix-ui/react-icons';
import { Button, Flex, AlertDialog, Grid, TextField, Text, Box, RadioCards, DropdownMenu } from '@radix-ui/themes'
import { toast } from 'sonner'

//redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import { updateWasher } from '@/lib/thunk/mesincuci/mesincuciThunk'
import { setWasherForm } from '@/redux/slices/mesinCuciSlice';

//utils
import { validateForm } from '@/utils/form-validation/validateForm'
import { FieldRules } from '@/utils/form-validation/singleFormValidation.model'
import { Washer } from '@/models/mesincuci.model'
import { setErrors, clearErrors } from '@/redux/slices/form-validation/singleForm'

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

function MesinCuciEditModal({data}: {data: Washer}) {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const {washerForm, status} = useSelector((state:RootState) => state.mesinCuci)
  const {errors} = useSelector((state:RootState) => state.singleForm)

  // DEBUG --------------------------
  //   useEffect(() => {
  //   console.log(washerForm)
  // }, [washerForm])
  // DEBUG -------------------------

  useEffect(() => {
    if(data) {
      dispatch(clearErrors())
      dispatch(setWasherForm({
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
    dispatch(setWasherForm({
      ...washerForm, 
      [name]: value
    }))
  }

  const formSubmit = (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    dispatch(clearErrors())
    const formError = validateForm(washerForm, rules)
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
    if(showConfirm || disabled){
      setDisabled(false)
      setShowConfirm(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [washerForm])

  useEffect(() => {
    if(status === "success") {
      setOpen(false)
    }
  }, [status])

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
                  defaultValue={washerForm.nama}
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
                    defaultValue={washerForm.merk}
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
                    defaultValue={washerForm.seri}
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
                    defaultValue={washerForm.tahun_pembuatan}
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
                    defaultValue={washerForm.tanggal_dibeli}
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
                  onChange={() => dispatch(setWasherForm({
                    ...washerForm, 
                    is_active: !washerForm.is_active
                  }))} 
                  defaultValue={washerForm.is_active?.toString()} 
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
                onConfirm={() => dispatch(updateWasher({ id: String(data.id), mesinCuci: washerForm }))} 
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