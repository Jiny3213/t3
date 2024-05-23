import { PrismaAdapter } from "@auth/prisma-adapter"
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth"
import { type Adapter } from "next-auth/adapters"
import DiscordProvider from "next-auth/providers/discord"
import Github from "next-auth/providers/github"
import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"

import { env } from "~/env"
import { db } from "~/server/db"
import * as argon2 from "argon2"
import { type DefaultJWT } from "next-auth/jwt"
import type { User as PrismaUser } from '@prisma/client'

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    id: string,
    user: {
      id: string;
      hasPassword: boolean
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface JWT extends DefaultJWT {
    hasPassword: boolean
  }

  interface User extends PrismaUser {
    
  }
  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }

}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // https://jinyuu.vercel.app
  // https://jinyuu.vercel.app/api/auth/callback/github
  callbacks: {
    session: ({ session, token, user }) => {
      // console.log('callbacks-session', session, token, user)
      // no user when using jwt strategy
      return {
        ...session,
        id: token.sub,
        user: {
          ...session.user,
          id: token.sub,
          hasPassword: token.hasPassword
        },
      }
    },
    jwt({ token, account, profile, user }) {
      console.log('jwt', token, account, profile, user)
      if(user) { // 登录时读取的 user 表信息
        token.hasPassword = !!user.password
      }
      return token
    }
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    Github({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }),
    EmailProvider({
      server: `smtp://pijiny@qq.com:${env.EMAIL_SECRET}@smtp.qq.com:587`,
      from: 'NextAuth <pijiny@qq.com>'
    }),
    CredentialsProvider({
      name: 'password',
      id: 'password',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        console.log(credentials)
        const user = await db.user.findFirst({
          where: { email: credentials?.email }
        })
        if(!credentials?.email || !credentials.password) {
          return null
        } else if(!user) {
          // return Promise.reject(new Error('用户未注册'))
          console.log('用户未注册')
          return null
        } else if(!user.password) {
          // return Promise.reject(new Error('用户未设置登录密码'))
          console.log('用户未设置登录密码')
          return null
        }
        
        const isMatch = await argon2.verify(user.password, credentials?.password)
        console.log('isMatch', isMatch)
        return isMatch ? user : null
      }
    })
  ],
}

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions)
