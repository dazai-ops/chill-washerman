"use client"

import { useState } from 'react'
import { AppDispatch, RootState } from '../redux/store'
import { clearError } from '../redux/slices/authSlice'
import { Box, Card, Flex, Text, TextField, Button, Grid } from '@radix-ui/themes'
import { useDispatch, useSelector } from 'react-redux'
import { loginAdmin } from '../redux/api/authThunk'
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'

interface User {
  username: string,
  password: string
}

function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error, user } = useSelector((state: RootState) => state.auth)

  const [userForm, setUserForm] = useState<User>({username: '', password: ''})
  const [messageFill, setMessageFill] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserForm({
      ...userForm,
      [e.target.name]: e.target.value
    })
    setMessageFill('')
    dispatch(clearError())
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!userForm.username || !userForm.password){
      return setMessageFill('Please fill in all fields')
    } 
    dispatch(loginAdmin(userForm))
  }

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
                <TextField.Root name='password' type={showPassword ? 'text' : 'password'} onChange={handleChange} >
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
                <Button type='submit'>{loading ? 'Loading...' : 'Login'}</Button>
              </Grid>

              {error && <Text className='text-red-500'>{error}</Text>}
              {messageFill && <Text className='text-red-500'>{messageFill}</Text>}
              {user && <Text className='text-green-500'>Login Success</Text>}
            </Flex>
          </form>
        </Card>
      </Box>
    </div>
  )
}

export default LoginPage
