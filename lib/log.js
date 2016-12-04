module.exports = scope => require('catlog')(`drepl:${scope ? scope : 'main'} `)
