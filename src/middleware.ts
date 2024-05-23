import { withAuth } from "next-auth/middleware"
import { getSession } from "next-auth/react"

// https://next-auth.js.org/configuration/nextjs#middleware
// you cannot get session here, use jwt
export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  async function middleware(req) {
    // console.log('middleware', req.nextauth.token)
    console.log('middleware', req.url)
  },
  {
    pages: {
      signIn: '/login',
    },
    callbacks: {
      authorized: ({ token }) => {
        // console.log('middleware-callbacks', token)
        // allow to the page
        if(!token) console.log('user not login', token)
        return !!token // 自动去到登录页
      },
    },
  },
)

export const config = { 
  // 需要登录后使用的路由
  matcher: [
    '/user', 
    '/upload', 
    '/translate'
  ] 
}