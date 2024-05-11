import { z } from "zod"
import { env } from "~/env"
import * as tencentcloud from "tencentcloud-sdk-nodejs"

const TmtClient = tencentcloud.tmt.v20180321.Client
const clientConfig = {
  credential: {
    secretId: env.TENCENT_SECRET_ID,
    secretKey: env.TENCENT_SECRET_KEY,
  },
  region: "ap-guangzhou",
  profile: {
    httpProfile: {
      endpoint: "tmt.tencentcloudapi.com",
    },
  },
}
const client = new TmtClient(clientConfig)

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc"

// 腾讯云翻译
// https://cloud.tencent.com/document/api/551/30636
export const translateRouter = createTRPCRouter({
  translateText: publicProcedure
    .input(z.object({
      text: z.string()
    }))
    .mutation(async ({input}) => {
      const params = {
          "SourceText": input.text,
          "Source": "zh",
          "Target": "en",
          "ProjectId": 0
      }
      const res = await client.TextTranslate(params)
      console.log(res)
      return res.TargetText
    })
})