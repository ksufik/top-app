/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  images: {
    domains: ['courses-top.ru'],
  },
  webpack(config, options) {
    config.module.rules.push({
      // любой файл с расширением svg
      test: /\.svg$/,
      // в файлах с расширениями js, jsx, ts, tsx
      issuer: /\.(js|ts)x?$/,
      //то используется загрузчик, который позволяет использовать svg как модули
      loader: '@svgr/webpack',
      options: {
        prettier: false,
        svgo: true,
        svgoConfig: {
          plugins: [
            {
              name: 'preset-default',
              params: {
                overwrite: {
                  removeViewBox: false,
                },
              },
            },
          ],
        },
        titleProp: true,
      },
    });
    return config;
  },
};

module.exports = nextConfig;
