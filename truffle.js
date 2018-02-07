// Allows us to use ES6 in our migrations and tests.
require('babel-register')
require('babel-polyfill')
require('babel-node-modules')([
  'zeppelin-solidity'
])

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*' // Match any network id
    }
  }
}
