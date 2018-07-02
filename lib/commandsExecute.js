// Copyright 2015 Bubl Technology Inc.
//
// Licensed under the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>.
// This file may not be copied, modified, or distributed
// except according to those terms.

'use strict'

var Q = require('q')
var poll = require('./poll')
var OscError = require('./OscError')

// OSC COMMANDS EXECUTE
var commandsRequest = function(name, parameters) {
  var commandsExecuteUrl = this.serverAddress + '/osc/commands/execute'
  const fetch = this.fetchClient

  return fetch(commandsExecuteUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-XSRF-Protected': '1'
    },
    body: JSON.stringify({name, parameters})
  }).then(response => {
    return response.ok
      ? response
      : response.json().then(body => {
          throw new OscError(body)
        })
  })
}

var commandsExecute = function(name, params, statusCallback) {
  var deferred = Q.defer()
  var client = this
  commandsRequest.apply(client, [name, params]).then(res => {
    if (res.headers.get('content-type') !== 'application/json; charset=utf-8') {
      // only for getImage command
      deferred.resolve(res.blob())
      return
    }

    res.json().then(body => {
      if (body.state === 'error') {
        deferred.reject(new OscError(body))
      } else if (body.state !== 'inProgress') {
        deferred.resolve(body)
      } else {
        var timeStamp = Date.now()
        var commandId = body.id
        poll.commandStatus(client, commandId, deferred, timeStamp, statusCallback)
      }
    })
  }).catch(err => deferred.reject(err))
  return deferred.promise
}

module.exports = commandsExecute
