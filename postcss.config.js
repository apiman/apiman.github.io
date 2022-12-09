const purgecss = require('@fullhuman/postcss-purgecss')
const postcss_scss = require("postcss-scss")

module.exports = {
    parser: 'postcss-scss',
    plugins: [
        purgecss({
            content: ['./_site/**/*.html']
        })
    ]
}
