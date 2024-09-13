import { type NextRequest, NextResponse } from "next/server"
import qiniu from 'qiniu'
import { env } from "~/env"
import axios from "axios"
import crypto from 'crypto'
import { db } from "~/server/db"
import { getServerAuthSession } from "~/server/auth"
import { CND_PATH } from "~/config"

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
  const originName = incomeFormData.get('originName') as string
  const mimeType = incomeFormData.get('mimeType') as string // mimeType
  const saveType = parseInt(incomeFormData.get('saveType') as string) || 1

  // 未登录或无文件
  if(!file || !session) return NextResponse.json({ error: true, message: 'error' })

  const formData = new FormData()
  const uploadToken = getUploadToken()
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  // 文件内容和时间戳生成hash，允许上传相同的文件
  const fileHash = crypto.createHash('md5').update(buffer).update(new Date().getTime().toString()).digest('hex')

  formData.append('token', uploadToken)
  formData.append('key', fileHash)
  formData.append('file', file)
  const response: any = await axios.post('http://up-z2.qiniup.com/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Authorization': `UpToken ${getUploadToken()}`,
    }
  }).then(response => {
    console.log('七牛云', response.data)
    return response
  }).catch(error => {
    console.error(error)
  })

  // 返回的内容只有这两个
  const hash = response.data.hash
  const key = response.data.key // 这个就是传入的文件名, key === fileHash
  const url = CND_PATH + key

  const dbres = await db.file.create({
    data: {
      hash,
      name: fileHash,
      originName,
      type: mimeType,
      saveType,
      url,
      createdBy: { connect: { id: session.id } }
    }
  })

  return NextResponse.json({
    key: response.data.key,
    url
  })
}