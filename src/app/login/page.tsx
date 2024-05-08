'use client'
import { useState } from "react"
import { api } from "~/trpc/react"
import axios from "axios"

export default function Login() {

  return (
    <>
    <div>登录</div>
    <div>
      账号<input type="text" style={{border: '1px solid #999'}}/>
    </div>
    <div>
      密码<input type="password" style={{border: '1px solid #999'}}/>
    </div>
    <button>提交</button>
    </>
  )
}