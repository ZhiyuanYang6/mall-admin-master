'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"http://192.168.1.111:8082/"' //王超华
  BASE_API: '"http://192.168.1.123:8088/"' //温明明
  // BASE_API: '"http://47.97.105.123:8080/"'
})
