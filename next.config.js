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
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
            { key: "Access-Control-Allow-Credentials", value: "true" },
            { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
            { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
            { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
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

  rewrites: async () => {
    return [
      {
        source: '/static/:path*',
        destination: 'http://cdn.jinyuu.cn/:path*',
      },
    ]
  }
};

export default config
