const parseBlock = require('gfm-code-blocks')
const detective = require('detective')
const install = require('./install')
const vm = require('vm')
const multiline = require('multiline')
const beautify = require('js-beautify')
const log = require('./log')
const pixie = require('pixie')
const match = require('match-block')
const lint = require('./lint')
const inspect = require('util').inspect

function repl(code, message) {
  message.channel.sendMessage('**Preparing...**').then(message => {
    const sandbox = {
      require: package => {
        if (package === 'fs') return
        return require(package)
      },
      console: {
        log: (text, format, block) => {
          text = format ? inspect(text, { showHidden: true, depth: null }) : text
          if (block) message.channel.sendCode('', text)
          else message.channel.sendMessage(text)
          return
        }
      },
      fs: {
        readFile() { return 'disabled' },
        readFileSync() { return 'disabled' }
      },
      util: require('util')
    }

    let block = parseBlock(code)
    if (block.length) {
      block = block.shift().code
    }
    if (!block.length) {
      const inline = code.match(/`(\s.+?|\w.+\s.+\b)*(.+?)`/g)
      if (!inline) return message.delete()
      block = match(inline.pop(), { nested: true })
    }

    lint(block, errors => {
      if (errors.length) {
        return message.edit(pixie.render(multiline.stripIndent(() => {
          /*
          **Linting Errors & Warnings**
          ```toml
          {{errors}}
          ```
          */
        }), { errors: errors.join('\n') }))
      }

      const deps = detective(block)

      message.edit('**Installing Packages...**')

      install(deps, (err, package) => {
        if (err) {
          return message.edit(pixie.render(multiline.stripIndent(() => {
            /*
            **Error**
            ```js
            {{err}}
            ```
            */
          }), { err }))
        }
        log('install').info(`install ${package}`)
      }, count => {
        message.edit(`**Installed ${count} packages**`).then(message => {
          try {
            const pretty = beautify(block, { indent_size: 2 })

            const script = new vm.Script(block, {
              timeout: 5000
            })
            const context = vm.createContext(sandbox)
            const out = inspect(script.runInContext(context, { timeout: 5000 }), { showHidden: true, depth: null })

            message.edit(pixie.render(multiline.stripIndent(() => {
              /*
              **Input**
              ```js
              {{pretty}}
              ```

              **Output**
              ```js
              {{out}}
              ```
              */
            }), { pretty, out }))
          } catch (e) {
            message.edit(pixie.render(multiline.stripIndent(() => {
              /*
              **Error**
              ```js
              {{e}}
              ```
              */
            }), { e }))
          }
        })
      })
    })
  })
}

module.exports = repl
