import { type NextRequest, NextResponse } from "next/server"
import qiniu from 'qiniu'
import { env } from "~/env"
import axios from "axios"
import crypto from 'crypto'
import { db } from "~/server/db"
import { getServerAuthSession } from "~/server/auth"
import { CDN_DOMAIN } from "~/config"

// 获取登录token
function getUploadToken() {
  const mac = new qiniu.auth.digest.Mac(env.QINIU_AK, env.QINIU_SK)
  const options = {
    scope: 't3oss',
    expires: 7200
  }
  const putPolicy = new qiniu.rs.PutPolicy(options)
  return putPolicy.uploadToken(mac)
}

// 上传文件到七牛云，trpc 不支持 formData
export async function POST(req: NextRequest) {
  const session = await getServerAuthSession()
  const incomeFormData = await req.formData()

  const file = incomeFormData.get('file') as File
  const originName = incomeFormData.get('key') as string
  const type = incomeFormData.get('type') as string // mimeType

  console.log(file)
  // 未登录或无文件
  if(!file || !session) return NextResponse.json({ error: true, message: 'error' })

  const formData = new FormData()
  const uploadToken = getUploadToken()
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const filename = crypto.createHash('md5').update(buffer).digest('hex')

  // 是否已有相同文件，通过hash判断
  const existFile = await db.file.findFirst({
    where: { name: filename }
  })
  if(existFile)return NextResponse.json({ error: true, message: 'error, exist file' })
  
  formData.append('token', uploadToken)
  formData.append('key', filename)
  formData.append('file', file)
  const response: any = await axios.post('http://up-z2.qiniup.com/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `UpToken ${getUploadToken()}`,
    }
  }).then(response => {
    console.log(response.data)
    return response
  }).catch(error => {
    console.error(error)
  })

  const hash = response.data.hash
  const key = response.data.key
  
  console.log(session)
  const dbres = await db.file.create({
    data: {
      hash,
      name: filename,
      originName,
      type,
      url: CDN_DOMAIN + filename, // 无法直接访问，获取时需要通过七牛云鉴权
      createdBy: { connect: { id: session.id } }
    }
  })
  console.log(dbres)

  return NextResponse.json(response.data)
}