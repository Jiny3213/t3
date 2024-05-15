/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js")
import os from 'node:os'

// 显示局域网地址
function getLocalIP() {
  const interfaces = os.networkInterfaces()
  Object.entries(interfaces).forEach(([name, iface]) => {
    iface?.forEach(item => {
      if (item.internal || item.family !== 'IPv4') {
        return
      }
      console.log(`http://${item.address}:${process.env.PORT}`)
    })
  })
}
process.env.PORT && getLocalIP()

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'sc0mb7a59.hn-bkt.clouddn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'cdn.jinyuu.cn',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default config
