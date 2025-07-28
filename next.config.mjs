import withTM from "next-transpile-modules"
import TerserPlugin from "terser-webpack-plugin"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack(config, { isServer }) {
    if (!isServer && config.optimization?.minimizer) {
      config.optimization.minimizer = config.optimization.minimizer.map(
        (plugin) => {
          // Safely recreate the plugin to avoid accessing private options
          if (plugin.constructor.name === "TerserPlugin") {
            return new TerserPlugin({
              parallel: true,
              terserOptions: {
                format: {
                  comments: false,
                },
              },
              exclude: /node_modules\/xlsx/,
            })
          }
          return plugin
        }
      )
    }
    return config
  },
}

export default withTM(["xlsx"])(nextConfig)
