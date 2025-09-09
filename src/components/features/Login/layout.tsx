"use client"

//lib
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Card, Flex, Text, TextField, Button, Grid } from '@radix-ui/themes'
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'

//utils
import { UserAuth } from '@/models/auth.model'

//redux
import { AppDispatch, RootState } from '@/redux/store'
import { clearError } from '@/redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { loginAdmin } from '@/lib/thunk/auth/authThunk'



const LoginLayout = () => {
  const router = useRouter()
  const dispatch = useDispatch<AppDispatch>()
  const { loading, success, error } = useSelector((state: RootState) => state.auth)
  
  const [userForm, setUserForm] = useState<UserAuth>({username: '', password: ''})
  const [showPassword, setShowPassword] = useState(false)

  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setUserForm({
      ...userForm,
      [name]: value
    })
    dispatch(clearError())
  }

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userForm.username || !userForm.password){
      return toast.error('Lengkapi form', {
        position: "top-center"
      })
    } 
    dispatch(loginAdmin(userForm))
  }

  useEffect(() => {
    if(error !== null) setUserForm({...userForm, password: ''})
    dispatch(clearError())
  }, [error, userForm])
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/admin')
    }, 2000)

    return () => clearTimeout(timer)
  }, [success, router])

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <Box className='w-96'>
        <Card size="3" className='p-4 flex flex-col items-center'>
          <Text size="5" weight="bold">
            Login Admin
          </Text>
          <form onSubmit={handleFormSubmit}>
            <Flex direction="column" gap="3" className='mt-4'>
              <Grid gap="1">
                <Text size="2" weight="bold">Username</Text>
                <TextField.Root className='mb-3' name='username' onChange={handleFormChange}/>
                <Text size="2" weight="bold">Password</Text>
                <TextField.Root 
                  name='password' 
                  type={showPassword ? 'text' : 'password'} 
                  value={userForm.password || ''}
                  onChange={handleFormChange} 

                >
                  <TextField.Slot>
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="focus:outline-none"
                    >
                      {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                    </button>
                  </TextField.Slot>
                </TextField.Root>
              </Grid>
              <Grid >
                <Button 
                  type='submit' 
                  disabled={loading}
                >
                    {loading ? 'Loading...' : 'Login'}
                </Button>
              </Grid>
            </Flex>
          </form>
        </Card>
      </Box>
    </div>
  )
}

export default LoginLayout
