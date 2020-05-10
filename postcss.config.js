const production = !process.env.ROLLUP_WATCH;
const purgecss = require('@fullhuman/postcss-purgecss')

module.exports = {
  plugins: [
    require('postcss-import')(),
    require('tailwindcss'),
    production &&
      purgecss({
        content: ['./*.js'],
        defaultExtractor: content => content.match(/[A-Za-z0-9-_:/]+/g) || []
      })
  ]
}
