'use client'
import { signIn, signOut } from 'next-auth/react'
import { Form, Input, Dialog, Button } from 'antd-mobile'
import { useState } from 'react'
import { getSession } from 'next-auth/react'

export default function Login() {
  const [isSignIn, setIsSignIn] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  getSession().then(session => {
    if(session) {
      setIsLogin(true)
    }
  })

  const onEmailSignIn = (values: any) => {
    signIn('email', { email: values.email })
  }

  async function onPasswordSignIn(values: any) {
    signIn('password', {
      email: values.email,
      password: values.password
    })
  }

  function checkEmail(_: any, value: string) {
    if(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
      return Promise.resolve()
    }
    return Promise.reject(new Error('请输入正确的邮箱'))
  }

  return (
    <div className='h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] p-4'>
      { isSignIn ? <Form
        className='rounded-lg'
        layout='horizontal'
        onFinish={onPasswordSignIn}
        mode='card'
        footer={
          <div>
            <Button block type='submit' color='primary' size='large'>
              SignIn
            </Button>
            <br />
            <p className='text-white'>没有账号？</p>
            <Button block color='default' size='large' onClick={() => setIsSignIn(false)}>
              switch to Email SignIn
            </Button>
            <br />
            { isLogin &&
              <Button block color='warning' size='large' onClick={() => signOut()}>
                SignOut
              </Button>
            }
          </div>
        }
      >
        <Form.Header><span className='text-white font-bold'>密码登录</span></Form.Header>
        <Form.Item
          name='email'
          label='邮箱'
          rules={[{ required: true, message: '邮箱不能为空' }, { validator: checkEmail }]}
        >
          <Input onChange={console.log} placeholder='请输入邮箱' />
        </Form.Item>
        <Form.Item
          name='password'
          label='密码'
          rules={[{ required: true, message: '密码不能为空' }]}
        >
          <Input onChange={console.log} type="password" placeholder='请输入密码' />
        </Form.Item>
      </Form>
      :
      <Form
        className='rounded-lg'
        layout='horizontal'
        onFinish={onEmailSignIn}
        mode='card'
        footer={
          <div>
            <Button block type='submit' color='primary' size='large'>
              SignIn
            </Button>
            <br /> 
            <Button block color='default' size='large' onClick={() => setIsSignIn(true)}>
              switch to password SignIn
            </Button>
          </div>
        }
      >
        <Form.Header><span className='text-white font-bold'>邮箱登录</span></Form.Header>
        <Form.Item
          name='email'
          label='邮箱'
          rules={[{ required: true, message: '邮箱不能为空' }, { validator: checkEmail }]}
        >
          <Input onChange={console.log} placeholder='请输入邮箱' />
        </Form.Item>
      </Form> }
    </div>
  )
}