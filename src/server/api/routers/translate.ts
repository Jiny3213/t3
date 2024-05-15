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

const MaxCount = 4500000 // 总限额5000000
const TranslationCountKey = 'tencent_translation_count'

// 腾讯云翻译
// https://cloud.tencent.com/document/api/551/30636
export const translateRouter = createTRPCRouter({
  translateText: publicProcedure
    .input(z.object({
      text: z.string(),
      source: z.string(),
      target: z.string()
    }))
    .mutation(async ({input, ctx}) => {
      const translationCount = await ctx.db.config.findUnique({
        where: { key: TranslationCountKey }
      })

      // 查询额度
      if(translationCount) {
        // 额度超限
        if(Number(translationCount.value) > MaxCount) {
          return '翻译额度已超限'
        }
        const res = await ctx.db.config.update({
          where: { key: TranslationCountKey },
          data: { value: (Number(translationCount.value) + input.text.length).toString() }
        })
        console.log(res)
      } else {
        const res = await ctx.db.config.create({
          data: {
            key: TranslationCountKey,
            value: input.text.length.toString()
          }        
        })
        console.log(res)
      }

      // 翻译
      const translation = await client.TextTranslate({
        "SourceText": input.text,
        "Source": input.source,
        "Target": input.target,
        "ProjectId": 0
      })

      return translation.TargetText || ''
    }),
    /**
     * 查询使用额度
     */
    translationCount: publicProcedure
      .query(async ({ ctx }) => {
        const res = await ctx.db.config.findUnique({
          where: { key: TranslationCountKey }
        })
        return res && Number(res.value) || 0
      })
})