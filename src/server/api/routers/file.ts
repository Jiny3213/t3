import { z } from "zod";
import qiniu from 'qiniu'
import { env } from "~/env";
import axios from 'axios'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const fileRouter = createTRPCRouter({
  // 获取用户所有文件
  getOwnFiles: protectedProcedure
    .query(async ({ ctx }) => {
      const ownFiles = await ctx.db.file.findMany({
        where: {
          createdById: ctx.session.id
        }
      })
      const mac = new qiniu.auth.digest.Mac(env.QINIU_AK, env.QINIU_SK)
      const config = new qiniu.conf.Config();
      const bucketManager = new qiniu.rs.BucketManager(mac, config);
      const privateBucketDomain = 'http://sc0mb7a59.hn-bkt.clouddn.com';
      const deadline = parseInt('' + Date.now() / 1000) + 3600; // 1小时过期

      return ownFiles.map(item => {
        item.url = bucketManager.privateDownloadUrl(privateBucketDomain, encodeURIComponent(item.name), deadline)
        return item
      })
    }),
  removeFiles: protectedProcedure
    .input(z.object({
      fileIds: z.number().array()
    }))
    .mutation(async ({input, ctx}) => {
      console.log(input)
      const resList = []
      const mac = new qiniu.auth.digest.Mac(env.QINIU_AK, env.QINIU_SK);
      const config = new qiniu.conf.Config();
      // @ts-ignore
      config.useHttpsDomain = true;
      // @ts-ignore
      config.regionsProvider = qiniu.httpc.Region.fromRegionId('z2');
      const bucketManager = new qiniu.rs.BucketManager(mac, config);
      const bucket = "t3oss";
      for(let id of input.fileIds) {
        console.log(id)
        const file = await ctx.db.file.findFirst({
          where: { id }
        })
        const key = file?.name || ''
        console.log(file)
        const ossRes = await new Promise(resolve => {
          bucketManager.delete(bucket, key, (e, body, info) => {
            console.log(e, body, info)
            if(!body) {
              // body: { error: 'no such file or directory' }
              // 即是成功
            }
            resolve({
              e, body, info
            })
          })
        })
        const res = await ctx.db.file.delete({
          where: {
            id
          }
        })
        resList.push(ossRes)
        resList.push(res)
      }
      return resList
    }),
  getToken: protectedProcedure
    .query(() => {
      const mac = new qiniu.auth.digest.Mac(env.QINIU_AK, env.QINIU_SK)
      const options = {
        scope: 't3oss',
        expires: 7200
      }
      const putPolicy = new qiniu.rs.PutPolicy(options)
      const uploadToken = putPolicy.uploadToken(mac);
      return uploadToken
    }),
})
