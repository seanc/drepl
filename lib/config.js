const hardOpts = require('rc')('drepl', {
  token: ''
})
const softOpts = require('minimist')(process.argv.slice(2))
const config = Object.assign(hardOpts, softOpts)
module.exports = config
