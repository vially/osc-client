// Copyright 2015 Bubl Technology Inc.
//
// Licensed under the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>.
// This file may not be copied, modified, or distributed
// except according to those terms.

var Q = require('q')
var OscError = require('./OscError')

// HTTP REQUEST
var makeHttpRequest = function(fetch, method, url, contentType, body) {
  'use strict'

  return fetch(url, {
    method,
    headers: { 'Content-Type': contentType, 'X-XSRF-Protected': '1' },
    body: JSON.stringify(body)
  }).then(
    response => {
      return response.ok
        ? response.json()
        : response.json().then(body => { throw new OscError(body) })
    }
  )
}

module.exports = makeHttpRequest
