'use client'
import { getSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { Session } from "next-auth"
import { api } from "~/trpc/react"
import JSEncrypt from 'jsencrypt'
import { RSA_PUB } from "~/config"
import { TextField, Button, Typography, Stack } from '@mui/material'
import { useForm, type SubmitHandler } from "react-hook-form"
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { signIn } from "next-auth/react"

export default function() {
  const [session, setSession] = useState<Session | null>(null)
  const [showSetPassword, setShowSetPassword] = useState(false)
  useEffect(() => {
    getSession().then(session => {
      if(session) {
        setSession(session)
        console.log(session)
      }
    })
  }, [])
  const setPasswordMutation = api.user.setPassword.useMutation()

  type Inputs = {
    password: string
    passwordConfirm: string
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data)
    const { password, passwordConfirm } = data
    if(password === passwordConfirm) {
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(RSA_PUB)
      const encrypted = encrypt.encrypt(password)
      await setPasswordMutation.mutateAsync({ password: String(encrypted)})
      // 登录一下，换取token
      const res = await signIn('password', {
        email: session?.user.email,
        password: password,
        redirect: false // 禁止重定向
      })
      if(res?.ok) {
        location.reload()
      } else {
        alert('An error occurred, Please check your account and password')
      }
    } else {
      alert('diff password!')
    }
  }
 
  return (
    <Stack alignItems="center" py={2} gap={2}>
      <Typography component="h1" variant="h6">Hello, {session?.user.email}</Typography>
      <Typography component="h1" variant="h6">{session?.user.hasPassword ? 'you has a password' : 'you has no password'}</Typography>
      {showSetPassword && <Card sx={{ width: 300, mt: 2 }}>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={2}>
              <Typography component="h1" variant="h6">set your password</Typography>
                <TextField 
                  id="password" 
                  label="password" 
                  type="password" 
                  {...register('password', { required: 'password is required' })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  ></TextField>
                <TextField 
                  id="passwordConfirm" 
                  label="passwordConfirm" 
                  type="password" 
                  {...register('passwordConfirm', { required: 'passwordConfirm is required' })}
                  error={!!errors.passwordConfirm}
                  helperText={errors.password?.message}
                  ></TextField>
              <Button variant="contained" type="submit">submit</Button>
            </Stack>
          </form>
        </CardContent>
      </Card>}
      <Button variant="contained" onClick={() => setShowSetPassword(!showSetPassword)}>{showSetPassword ? 'cancel' : session?.user.hasPassword ? 'reset your password' : 'set a password'}</Button>
      <Button variant="contained" onClick={() => signOut()}>sign out</Button>
    </Stack>
  )
}