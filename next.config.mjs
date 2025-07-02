/** @type {import('next').NextConfig} */
const nextConfig = {
  // 基础配置
  reactStrictMode: true,
  swcMinify: true,
  
  // 实验性功能
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['axios'],
  },

  // 图片配置
  images: {
    domains: [
      'localhost',
      'ckbapi.quwanzhi.com',
      'blob.v0.dev',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com'
    ],
    formats: ['image/webp', 'image/avif'],
    unoptimized: true, // 添加unoptimized配置
  },

  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/scenarios/new',
        destination: '/scenarios/new/basic',
        permanent: false,
      },
    ]
  },

  // 重写配置 - 用于API代理
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
      },
    ]
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ]
  },

  // Webpack配置
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // 添加自定义webpack配置
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname),
    }

    // 处理GitHub项目的兼容性
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    }

    return config
  },

  // 输出配置
  output: 'standalone',

  // 压缩配置
  compress: true,

  // 电源配置
  poweredByHeader: false,

  // 生成ETag
  generateEtags: true,

  // 页面扩展名
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // 跟踪配置
  trailingSlash: false,

  // 构建配置
  distDir: '.next',

  // 静态优化
  staticPageGenerationTimeout: 60,

  // 开发配置
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),

  // 添加eslint和typescript配置
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

// Bundle分析器配置
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  })
  module.exports = withBundleAnalyzer(nextConfig)
} else {
  module.exports = nextConfig
}
