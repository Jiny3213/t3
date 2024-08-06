import { z } from "zod"
import qiniu from 'qiniu'
import { env } from "~/env"
import { CDN_DOMAIN } from "~/config"
import { CycleType } from "@prisma/client"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const cycleCostRouter = createTRPCRouter({
  getAll: protectedProcedure
    .query(async ({ctx}) => {
      const CycleCostList = await ctx.db.cycleCost.findMany({
        where: { userId: ctx.session.id }
      })
      return CycleCostList
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      cycleType: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
      cost: z.number(),
      startAt: z.date(),
      remark: z.string().optional()
    }))
    .mutation(async ({ctx, input}) => {
      return ctx.db.cycleCost.create({
        data: {
          ...input,
          userId: ctx.session.id
        }
      })
    }),
  
  update: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
      cycleType: z.enum(['DAY', 'WEEK', 'MONTH', 'YEAR']),
      cost: z.number(),
      startAt: z.date(),
      remark: z.string().optional()
    }))
    .mutation(async ({ctx, input}) => {
      return ctx.db.cycleCost.update({
        where: {
          userId: ctx.session.id,
          id: input.id
        },
        data: input
      })
    }),
  
  delete: protectedProcedure
    .input(z.object({
      id: z.number()
    }))
    .mutation(async ({ctx, input}) => {
      return ctx.db.cycleCost.delete({
        where: { id: input.id }
      })
    })
})