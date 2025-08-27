//lib
import { useState, useEffect } from 'react'
import { Button, Flex, AlertDialog, Grid, TextField, Text, Box } from '@radix-ui/themes'
import { useDispatch, useSelector } from 'react-redux'

//redux
import { AppDispatch, RootState } from '@/redux/store'
import { clearErrors } from '@/redux/slices/form-validation/singleForm'
import { addApparel } from '@/lib/thunk/jenispakaian/jenispakaianThunk'

// utils
import { Apparel } from '@/models/jenispakaian.model';
import { validateForm } from '@/utils/form-validation/validateForm'
import { FieldRules } from '@/utils/form-validation/singleFormValidation.model'
import { clearForm, setErrors } from '@/redux/slices/form-validation/singleForm'

// component
import ErrorMessage from '../../ui/FieldError/ErrorMessage';
import { clearApparelForm, setApparelForm } from '@/redux/slices/jenispakaianSlice';

const rules: Record<string, FieldRules> = {
  jenis_pakaian: ['required'],
  satuan: ['required'],
  harga_per_item: ['required'],
  harga_per_kg: ['required'],
  estimasi_waktu: ['required'],
}

function JenisPakaianCreateModal() {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const {apparelForm} = useSelector((state:RootState) => state.jenisPakaian)
  const {errors} = useSelector((state:RootState) => state.singleForm)


  const formChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = e.target
    dispatch(setApparelForm({
      ...apparelForm,
      [name]: value
    }))
  }

  const formSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formError = validateForm(apparelForm, rules)
    
    if (formError.length > 0) {
      dispatch(setErrors(formError))
      setDisabled(true)
    } else {
      dispatch(clearErrors())
      dispatch(addApparel(apparelForm as Apparel))
      setOpen(false)
    } 
  }

  const getErrorMessage = (field: string) => {
    return errors.find((err) => err.field === field)?.message
  }
  
  useEffect(() => {
      dispatch(clearApparelForm())
      dispatch(clearForm())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    setDisabled(false)
  }, [apparelForm])

  //DEBUG --------------------
  // useEffect(() => {
  //   console.log(apparelForm)
  // }, [apparelForm])
  //DEBUG --------------------

  return (
    <AlertDialog.Root open={open} >
      <AlertDialog.Trigger>
        <Button 
          size="3" 
          onClick={() => setOpen(true)} 
          color='gray' 
          highContrast
        >Add new...
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="500px">
        <AlertDialog.Title>Tambah Jenis Pakaian</AlertDialog.Title>

        <AlertDialog.Description >
          Isi form dibawah ini
        </AlertDialog.Description>

        <form onSubmit={(e) => formSubmit(e)}>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Flex className='w-full' gap="2">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Jenis Pakaian</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('jenis_pakaian') ? 'border border-red-500' : ''}`} 
                    name='jenis_pakaian' 
                    onChange={formChange} 
                  />
                  <ErrorMessage 
                    message={getErrorMessage('jenis_pakaian') ?? ''}
                    className="mt-[-2px]"
                  />
                </Box>
                <Box className='w-full'>
                  <Text size="2" weight="bold">Satuan</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('satuan') ? 'border border-red-500' : ''}`} 
                    name='satuan' 
                    onChange={formChange}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('satuan') ?? ''}
                    className="mt-[-2px]"
                  />
                </Box>
              </Flex>
              <Flex className='w-full' gap="2">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Harga / (kg)</Text>
                  <TextField.Root 
                    type='number' 
                    min="0"
                    size="3"
                    defaultValue={0}
                    className={`mb-1 ${getErrorMessage('harga_per_kg') ? 'border border-red-500' : ''}`} 
                    name='harga_per_kg' 
                    onChange={formChange}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('harga_per_kg') ?? ''}
                    className="mt-[-2px]"
                  />
                </Box>
                <Box className='w-full'>
                  <Text size="2" weight="bold">Harga / (item)</Text>
                  <TextField.Root 
                    type='number'
                    min="0" 
                    size="3"
                    defaultValue={0}
                    className={`mb-1 ${getErrorMessage('harga_per_item') ? 'border border-red-500' : ''}`} 
                    name='harga_per_item' 
                    onChange={formChange}
                  />
                  <ErrorMessage 
                    message={getErrorMessage('harga_per_item') ?? ''}
                    className="mt-[-2px]"
                  />
                </Box>
              </Flex>
              <Text size="2" weight="bold">Estimasi Waktu</Text>
              <TextField.Root 
                size="3"
                min="0"
                type='number'
                className={`mb-1 ${getErrorMessage('estimasi_waktu') ? 'border border-red-500' : ''}`} 
                name='estimasi_waktu' 
                onChange={formChange}
              />
              <ErrorMessage 
                message={getErrorMessage('estimasi_waktu') ?? ''}
                className="mt-[-2px]"
              />
            </Grid>
          </Flex>
          <Flex gap="3" mt="4" justify="between">
            <Button type='reset' color='yellow'>
              Reset
            </Button>
            <Flex gap={"3"}>
              <AlertDialog.Cancel>
                <Button 
                  color='gray' 
                  onClick={() => setOpen(false)}
                >
                  Batal
                </Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action>
                <Button 
                  type='submit' 
                  color='green'
                  disabled={disabled}
                >
                  Submit
                </Button>
              </AlertDialog.Action>
            </Flex>
          </Flex>
        </form>

      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default JenisPakaianCreateModal