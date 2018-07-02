/* global describe, it */

var makeHttpRequest = require('../lib/makeHttpRequest')
var assert = require('assert')
var fetch = require('cross-fetch')

describe('makeHttpRequest', function () {
  it('should return a promise', function () {
    var prom = makeHttpRequest(fetch, 'GET', 'http://localhost/')
    assert(typeof prom.then === 'function')
    assert(typeof prom.catch === 'function')
  })
})
