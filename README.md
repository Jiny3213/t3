# Create By T3

使用 nextjs、typescript、trpc、prisma 构建的全栈项目，关于 T3 详见 https://create.t3.gg/

项目地址 [t3.jinyuu.cn](https://t3.jinyuu.cn/)

## prisma 常用命令及相关问题

- npx prisma migrate dev --name image 同步数据库
- npx prisma generate 生成客户端
- npx prisma studio
- npx prisma db pull 拉一下一个陌生的数据库，获取model
- Prisma，我只是更新一下表结构，你为什么要重置我的数据库！？https://juejin.cn/post/7361629576416116777
- 官网指南如何初始化数据库 https://www.prisma.io/docs/orm/prisma-migrate/workflows/baselining

## 技术栈及服务

- oss存储：七牛云 http 有免费额度
- 云服务：vercel
- 域名解析服务：cloudflare
- 数据库：mysql
- 数据库图形化工具：DBeaver、prisma studio
- 翻译服务：腾讯云

## 相关文档

- tailwindcss https://tailwindcss.com/docs/installation
- mui https://mui.com/material-ui/all-components/
- 七牛云sdk https://developer.qiniu.com/kodo/1289/nodejs
- 七牛云上传接口 https://developer.qiniu.com/kodo/1312/upload
- 将腾讯云域名用 cloudflare 解析，代理到 vercel，从而实现国内访问 https://juejin.cn/post/7301193497247727652
- 腾讯云翻译接口 https://cloud.tencent.com/document/api/551/15619
- DBeaver 连接超时解决办法 https://www.zhihu.com/question/384806850/answer/2262290011
- antd 存在全局样式污染问题，引入组件会设置全局a标签颜色 https://github.com/ant-design/ant-design-mobile/issues/151

## 问题记录

- 本地开发登录态失效问题：本地同时开启多个使用 NextAuth 登录的服务会导致 localhost 其他端口登录态失效，因为 Cookie 被覆盖了 https://juejin.cn/post/7247697988292886585
- 免费版 Cloudflare 支持的HTTP端口：80，8080，8880，2052，2082，2086，2095；HTTPS端口：443，2053，2083，2087，2096，8443。其他端口无法使用，因此访问数据库改用ip连接。