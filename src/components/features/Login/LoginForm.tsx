"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { UserAuth } from '@/models/auth.model'
import { AppDispatch, RootState } from '@/redux/store'
import { clearError } from '@/redux/slices/authSlice'
import { useDispatch, useSelector } from 'react-redux'
import { loginAdmin } from '@/lib/thunk/auth/authThunk'

import { Box, Card, Flex, Text, TextField, Button, Grid } from '@radix-ui/themes'
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import { toast } from 'sonner'

function LoginForm() {
  const router = useRouter()
console.log("hello")
  const dispatch = useDispatch<AppDispatch>()
  const { loading, success, error } = useSelector((state: RootState) => state.auth)
  
  const [userForm, setUserForm] = useState<UserAuth>({username: '', password: ''})
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setUserForm({
      ...userForm,
      [name]: value
    })
    dispatch(clearError())
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!userForm.username || !userForm.password){
      return toast.error('Fill all fields', {
        position: "top-center"
      })
    } 
    dispatch(loginAdmin(userForm))
  }

  useEffect(() => {
    if(error) setUserForm({...userForm, password: ''})
  }, [error])
  
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
          <form onSubmit={handleSubmit}>
            <Flex direction="column" gap="3" className='mt-4'>
              <Grid gap="1">
                <Text size="2">Username</Text>
                <TextField.Root className='mb-3' name='username' onChange={handleChange}/>
                <Text size="2">Password</Text>
                <TextField.Root 
                  name='password' 
                  type={showPassword ? 'text' : 'password'} 
                  value={userForm.password || ''}
                  onChange={handleChange} 

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
                <Button type='submit' disabled={loading}>{loading ? 'Loading...' : 'Login'}</Button>
              </Grid>
            </Flex>
          </form>
        </Card>
      </Box>
    </div>
  )
}

export default LoginForm
