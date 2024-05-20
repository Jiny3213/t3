import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"
import JSEncrypt from 'jsencrypt'
import { env } from "~/env"
import * as argon2 from "argon2"

const decrypt = new JSEncrypt()
decrypt.setPrivateKey(env.RSA_PRIV)

export const userRouter = createTRPCRouter({
  setPassword: protectedProcedure
    .input(z.object({
      password: z.string()
    }))
    .mutation(async ({input, ctx}) => {
      console.log(input.password)
      console.log(ctx.session.id)
      const uncrypted = decrypt.decrypt(input.password)
      const hash = await argon2.hash(String(uncrypted))
      console.log('hash', hash)
      
      const res = await ctx.db.user.update({
        where: { id: ctx.session.id },
        data: { password: hash }
      })
      console.log(res)
      
      return 'success'
    })
})