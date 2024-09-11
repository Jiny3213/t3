import { z } from "zod"
import { CycleType } from "@prisma/client"

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

export const clothesRouter = createTRPCRouter({
  getCategory: protectedProcedure
    .query(async({ctx}) => {
      return ctx.db.clothesCategory.findMany({
        where: { userId: ctx.session.id }
      })
    }),
  
  createCategory: protectedProcedure
    .input(z.object({
      pid: z.number().optional(),
      name: z.string(),
    }))
    .mutation(async ({ctx, input}) => {
      return ctx.db.clothesCategory.create({
        data: {
          ...input,
          userId: ctx.session.id
        }
      })
    }),

  updateCategory: protectedProcedure
    .input(z.object({
      id: z.number(),
      pid: z.number().optional(),
      name: z.string()
    }))
    .mutation(async ({ctx, input}) => {
      return ctx.db.clothesCategory.update({
        where: {
          userId: ctx.session.id,
          id: input.id
        },
        data: {
          pid: input.pid,
          name: input.name
        }
      })
    }),

  getClothes: protectedProcedure
    .input(z.object({
      categoryId: z.number().optional()
    }))
    .query(async({ctx, input}) => {
      return ctx.db.clothes.findMany({
        where: { 
          userId: ctx.session.id,
          ...input.categoryId ? { categoryId: input.categoryId } : {}
        }
      })
    }),
  
  createClothes: protectedProcedure
    .input(z.object({
      name: z.string(),
      cover: z.string().optional(),
      buyAt: z.date().optional(),
      cost: z.number().optional(),
      location: z.string().optional(),
      categoryId: z.number().optional(),
    }))
    .mutation(async ({ctx, input}) => {
      return ctx.db.clothes.create({
        data: {
          ...input,
          userId: ctx.session.id
        }
      })
    }),

  updateClothes: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string(),
      cover: z.string().optional(),
      buyAt: z.date().optional(),
      cost: z.number().optional(),
      location: z.string().optional(),
      categoryId: z.number().optional(),
    }))
    .mutation(async ({ctx, input}) => {
      const { id, ...data } = input
      return ctx.db.clothes.update({
        where: {
          userId: ctx.session.id,
          id
        },
        data: {
          ...data
        }
      })
    }),
})