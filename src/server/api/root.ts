import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc"
import { postRouter } from "~/server/api/routers/post"
import { fileRouter } from "./routers/file"
import { translateRouter } from "./routers/translate"
import { userRouter } from "./routers/user"
import { cycleCostRouter } from "./routers/cycleCost"
import { clothesRouter } from "./routers/clothes" 

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  file: fileRouter,
  translate: translateRouter,
  user: userRouter,
  cycleCost: cycleCostRouter,
  clothes: clothesRouter
})

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
