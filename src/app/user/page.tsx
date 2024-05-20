'use client'
import { getSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import { Session } from "next-auth"
import { Button, Form, Input, Toast } from "antd-mobile"
import { api } from "~/trpc/react"
import JSEncrypt from 'jsencrypt'
import { RSA_PUB } from "~/config"

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
  async function setPassword(values: any) {
    console.log(values)
    if(values.password === values.passwordConfirm) {
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(RSA_PUB)
      const encrypted = encrypt.encrypt(values.password)
      console.log(encrypted)
      const res = await setPasswordMutation.mutateAsync({
        password: String(encrypted)
      })
      console.log(res)
      Toast.show({
        icon: 'success',
        content: '设置成功'
      })
    } else {
      Toast.show({
        icon: 'fail',
        content: '密码不一致'
      })
    }
  }

  return (
    <div className="h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4">
      <p className="text-white">{session?.user.email}</p>
      { showSetPassword && <Form
        className='rounded-lg'
        layout='horizontal'
        onFinish={setPassword}
        mode='card'
        footer={
          <div>
            <Button block type='submit' color='primary' size='large'>
              Submit
            </Button>
          </div>
        }
      >
        <Form.Header>设置密码</Form.Header>
        <Form.Item
          name='password'
          label='密码'
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input onChange={console.log} type="password" placeholder='请输入密码' />
        </Form.Item>
        <Form.Item
          name='passwordConfirm'
          label='确认密码'
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input onChange={console.log} type="password" placeholder='请输入密码' />
        </Form.Item>
      </Form> }
      <Button block color='primary' size='large' onClick={() => setShowSetPassword(!showSetPassword)}>
        { showSetPassword ? 'cancel' : 'Set a password' }
      </Button>
      <br />
      <Button block color='default' size='large' onClick={() => signOut()}>
        SignOut
      </Button>
    </div>
  )

}