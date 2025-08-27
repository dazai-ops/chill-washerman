//lib
import { useState, useEffect } from 'react'
import { PersonIcon } from '@radix-ui/react-icons';
import { Button, Flex, AlertDialog, Grid, TextField, Text, Box, RadioCards } from '@radix-ui/themes'

//redux
import { AppDispatch, RootState } from '@/redux/store'
import { useSelector, useDispatch } from 'react-redux'
import { clearForm, setErrors, clearErrors } from '@/redux/slices/form-validation/singleForm'
import { addWasher } from '@/lib/thunk/mesincuci/mesincuciThunk'
import { resetWasherForm, setWasherForm } from '@/redux/slices/mesinCuciSlice'


//utils
import { Washer } from '@/models/mesincuci.model';
import { FieldRules } from '@/utils/form-validation/singleFormValidation.model'
import { validateForm } from '@/utils/form-validation/validateForm'

//components
import ErrorMessage from '@/components/ui/FieldError/ErrorMessage'

const rules: Record<string, FieldRules> = {
  merk: ['required'],
  seri: ['required'],
  tahun_pembuatan: ['required'],
  tanggal_dibeli: ['required'],
}

function MesinCuciCreateModal() {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const {washerForm} = useSelector((state:RootState) => state.mesinCuci)
  const {errors} = useSelector((state:RootState) => state.singleForm)

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    dispatch(setWasherForm({
      ...washerForm,
      [name]: value
    }))
  }

  const handleFormSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formError = validateForm(washerForm, rules)
    
    if (formError.length > 0) {
      dispatch(setErrors(formError))
      setDisabled(true)
    } else {
      dispatch(clearErrors())
      dispatch(addWasher(washerForm as Washer))
      setOpen(false)
    } 
  }

  const getErrorMessage = (field: string) => {
    return errors.find((err) => err.field === field)?.message
  }
  
  useEffect(() => {
    dispatch(resetWasherForm())
    dispatch(clearForm())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    setDisabled(false)
  }, [washerForm])

  return (
    <AlertDialog.Root open={open}>
      <AlertDialog.Trigger>
        <Button size="3" color='gray' onClick={() => setOpen(true)} highContrast><PersonIcon/>Add new...</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="500px">
        <AlertDialog.Title>Tambah Mesin Cuci</AlertDialog.Title>

        <AlertDialog.Description >
          Isi form dibawah ini
        </AlertDialog.Description>

        <form onSubmit={(e) => handleFormSubmit(e)}>
          <Flex direction="column" gap="3" className='mt-4'>
            <Grid gap="1">
              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Merek</Text>
                  <TextField.Root 
                    size="3" 
                    className={`mb-1 ${getErrorMessage('merk') ? 'border border-red-500' : ''}`}
                    name='merk' 
                    onChange={handleFormChange}
                  />
                  <ErrorMessage message={getErrorMessage('merk') ?? ''}/>
                </Box>
                <Box className='w-full'>
                  <Text size="2" weight="bold">Seri</Text>
                  <TextField.Root 
                    size="3"  
                    name='seri' 
                    className={`mb-1 ${getErrorMessage('seri') ? 'border border-red-500' : ''}`}
                    onChange={handleFormChange}
                  />
                  <ErrorMessage message={getErrorMessage('seri') ?? ''}/>
                </Box>
              </Flex>

              <Flex className='w-full' gap="3">
                <Box className='w-full'>
                  <Text size="2" weight="bold">Tahun Pembuatan</Text>
                  <TextField.Root 
                    size="3" 
                    type='number' 
                    min="1991" 
                    max={new Date().getFullYear().toString()}  
                    name='tahun_pembuatan' 
                    className={`mb-1 ${getErrorMessage('tahun_pembuatan') ? 'border border-red-500' : ''}`}
                    onChange={handleFormChange}
                  />
                  <ErrorMessage message={getErrorMessage('tahun_pembuatan') ?? ''}/>
                </Box>
        
                <Box className='w-full'>
                  <Text size="2" weight="bold">Tanggal Dibeli</Text>
                  <TextField.Root 
                    size="3" 
                    type='date'  
                    name='tanggal_dibeli' 
                    className={`mb-1 ${getErrorMessage('tanggal_dibeli') ? 'border border-red-500' : ''}`}
                    onChange={handleFormChange}
                  />
                  <ErrorMessage message={getErrorMessage('tanggal_dibeli') ?? ''}/>
                </Box>
              </Flex>

              <Text size="2" weight="bold">Status</Text>
              <Box maxWidth="600px">
                <RadioCards.Root 
                  name='is_active' 
                  onValueChange={(value: string) => dispatch(setWasherForm({...washerForm, is_active: value === 'true' ? true : false}))} 
                  defaultValue='true'
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
              </Box>
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

export default MesinCuciCreateModal