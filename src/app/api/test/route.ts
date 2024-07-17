import { type NextRequest, NextResponse } from "next/server"
let count = 0

// 这个接口用于测试服务器缓存是否生效，是否多次请求
export async function GET(req: NextRequest) {
  console.log('get /api/test', count)
  return NextResponse.json({test: 'test', count: count++})
}