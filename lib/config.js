const hardOpts = require('rc')('drepl', {
  token: ''
})
const softOpts = require('minimist')(process.argv.slice(2))
Object.assign(hardOpts, softOpts)
module.exports = config
