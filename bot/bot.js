const Client = require('discord.js').Client
const bot = new Client()

const log = require('../lib/log')('bot')
const repl = require('../lib/repl')
const config = require('../lib/config')
const low = require('lowdb')

const prefix = '>>'
const db = low('db.json')

db.defaults({ users: [] }).value()

bot.on('ready', () => log.info('started'))

bot.on('message', message => {
  if (!message.content.startsWith(prefix)) return
  const users = message.mentions.users.array()
  if (message.content.startsWith(prefix + 'permit')
      && users.length
      && message.author.id === config.owner) {
    users.forEach(user => {
      db.get('users').push(user.id).value()
    })
    const permitted = users.map(u => u.username).join(', ')
    message.reply(`Permitted users ${permitted}`)
    return
  }
  if (message.content.startsWith(prefix + 'unpermit')
      && users.length
      && message.author.id === config.owner) {
    users.forEach(user => {
      const res = db.get('users').remove(u => u === user.id).value()
    })
    const unpermitted = users.map(u => u.username).join(', ')
    message.reply(`Unpermitted users ${unpermitted}`)
    return
  }
  if (!db.get('users').includes(message.author.id).value()) return
  repl(message.content.slice(prefix.length).trim(), message)
})

bot.login(config.token)
