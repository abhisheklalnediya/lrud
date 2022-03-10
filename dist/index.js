
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./lrud.cjs.production.min.js')
} else {
  module.exports = require('./lrud.cjs.development.js')
}
