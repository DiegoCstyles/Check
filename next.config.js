/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactServerComponents: true,
    },
    output: 'export',
    trailingSlash: true,
}

module.exports = nextConfig

