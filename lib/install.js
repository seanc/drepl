const npm = require('npmi')
const each = require('each-async')
const noop = require('noop4')
const builtin = require('is-builtin-module')

const blacklist = [
  'fs'
]

function install(packages, cb, done) {
  cb = cb || noop(0)
  if (!packages.length) done()
  if (packages.includes('discord.js')) packages.splice(packages.indexOf('discord.js'), 1)

  packages = packages.filter(package => !builtin(package))
  packages = packages.filter(package => !blacklist.includes(package))

  each(packages, (name, index, done) => {
    npm({ name }, (err, result) => {
      if (err) return cb(err)

      cb(null, name)
      done()
    })
  }, err => {
    done(packages.length)
  })
}

module.exports = install
