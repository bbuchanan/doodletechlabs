const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new FilterWarningsPlugin({
          // This regex will match the warning message about the missing source map
          exclude: /Failed to parse source map.*marked\.umd\.js\.map/,
        }),
      ],
    },
  },
};
