'use client'
import { signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { TextField, Button, Typography, Stack } from '@mui/material'
import { useForm, type SubmitHandler } from "react-hook-form"
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

type Inputs = {
  email: string
  password: string
}

const PasswordLoginForm = () => {
  const router = useRouter()
  const [isPassword, setIsPassword] = useState(true)
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if(isPassword) {
      const res = await signIn('password', {
        email: data.email,
        password: data.password,
        redirect: false // 禁止重定向
      })
      if(res?.ok) {
        router.push('/user')
      } else {
        alert('An error occurred, Please check your account and password')
      }
    } else {
      // 注意ddos
      const res = await signIn('email', { email: data.email, redirect: false })
      if(res?.ok) {
        alert('The login email has been sent, please check your email')
      } else {
        alert('An error occurred...')
      }
    }
  }
  // console.log(watch("email"))
  return <form onSubmit={handleSubmit(onSubmit)}>
    <Stack gap={2}>
      <Typography component="h1" variant="h6">{ isPassword ? 'Password SignIn' : 'Email SignIn' }</Typography>
      <TextField 
        id="email" 
        label="email" 
        {...register('email', { required: 'email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'not an email' } })}
        error={!!errors.email}
        helperText={errors.email?.message}
        ></TextField>
      { isPassword &&
        <TextField 
          id="password" 
          label="password" 
          type="password" 
          {...register('password', { required: 'password is required' })}
          error={!!errors.password}
          helperText={errors.password?.message}
          ></TextField>
      }
      <Button variant="contained" type="submit">SignIn</Button>
      { isPassword ?
        <>
          <Typography color="#666">Don’t have an account?</Typography>
          <Button variant="outlined" onClick={() => setIsPassword(false)}>switch to Email SignIn</Button>
        </>
        :
        <>
          <Typography color="#666">Already have an account?</Typography>
          <Button variant="outlined" onClick={() => setIsPassword(true)}>switch to Password SignIn</Button>
        </>
      }
    </Stack>
  </form>
}

export default function Login() {
  // todo: 已登录的进入登录页
  const [isLogin, setIsLogin] = useState(false)

  getSession().then(session => {
    if(session) {
      setIsLogin(true)
    }
  })

  return (
    <Stack alignItems="center" py={2}>
      <Card sx={{ width: 300, mt: 2 }}>
        <CardContent>
          <PasswordLoginForm></PasswordLoginForm>
        </CardContent>
      </Card>
    </Stack>
  )
}