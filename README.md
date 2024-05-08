# Create By T3

see jinyuu.vercel.app

## 新增或修改模型后执行
npx prisma migrate dev --name image 同步数据库
npx prisma generate 生成客户端

## 技术栈

- oss存储：Amazon S3、七牛云
- 云服务：vercel
- 域名解析服务 https://www.cloudflare.com/zh-cn/

## 相关文档

- tailwindcss https://tailwindcss.com/docs/installation
- mui https://mui.com/material-ui/all-components/
- 七牛云sdk https://developer.qiniu.com/kodo/1289/nodejs
- 七牛云上传接口 https://developer.qiniu.com/kodo/1312/upload
- 将腾讯云域名解析到cloudflare，再解析到vercel，从而实现国内访问 https://juejin.cn/post/7301193497247727652

## 注意

- 本地开发登录态失效问题：本地同时开启多个使用 NextAuth 登录的服务会导致 localhost 其他端口登录态失效，因为 Cookie 被覆盖了 https://juejin.cn/post/7247697988292886585
- Cloudflare支持的HTTP端口：80，8080，8880，2052，2082，2086，2095。
- Cloudflare支持的HTTPS端口：443，2053，2083，2087，2096，8443。其他端口无法使用，因此访问数据库改用ip连接。