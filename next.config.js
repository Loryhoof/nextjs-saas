/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: [
      '@react-email/components',
      '@react-email/render',
      '@react-email/tailwind'
  ]
  },
  images: {
    domains: ['github.com', 'lh3.googleusercontent.com']
  }
}

module.exports = nextConfig
