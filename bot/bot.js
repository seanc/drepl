const Client = require('discord.js').Client
const bot = new Client()

const log = require('../lib/log')('bot')
const repl = require('../lib/repl')
const config = require('../lib/config')

const prefix = '>> '

bot.on('ready', () => log.info('started'))

bot.on('message', message => {
  if (!message.content.startsWith(prefix)) return
  repl(message.content.slice(prefix.length).trim(), message)
})

bot.login(config.token)
