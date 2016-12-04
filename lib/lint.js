const standard = require('standard')
const each = require('each-async')

const blacklist = [
  'eol-last',
  'semi'
]

function lint(code, cb) {
  standard.lintText(code, (err, result) => {
    if (!result.errorCount && !result.warningCount) return cb([])

    const out = []

    result.results.forEach(result => {
      result.messages = result.messages.filter(message => !blacklist.includes(message.ruleId))
      result.messages.forEach(message => {
        out.push(`[${message.line}:${message.column}] ${message.ruleId} ${message.message}`)
      })
    })

    cb(out)
  })
}

module.exports = lint
