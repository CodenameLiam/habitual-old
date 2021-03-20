module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
          require.resolve('babel-plugin-module-resolver'),
          {
              root: ['./src'],
              extensions: [
                  '.ios.ts',
                  '.android.ts',
                  '.ts',
                  '.ios.tsx',
                  '.android.tsx',
                  '.tsx',
                  '.jsx',
                  '.js',
                  '.json',
              ],
              alias: {
                  Navigation: './src/Navigation',
                  Components: './src/Components',
                  Context: './src/Context',
                  Screens: './src/Screens',
                  Controllers: './src/Controllers',
                  Styles: './src/Styles',
              },
          },
      ],
    ],
  };
};
