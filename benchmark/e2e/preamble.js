'use strict'

if (process.env.DD_BENCH_TRACE_ENABLE) {
  require('../..').init({
    agent: new URL('tcp://localhost:3117')
  })
} else if (process.env.DD_BENCH_ASYNC_HOOKS) {
  const asyncHooks = require('async_hooks')
  const hook = asyncHooks.createHook({
    init () {},
    before () {},
    after () {},
    destroy () {}
  })
  hook.enable()
}
const { Server } = require('http')
const origEmit = Server.prototype.emit
Server.prototype.emit = function (name) {
  if (name === 'listening') { process.send && process.send({ ready: true }) }
  return origEmit.apply(this, arguments)
}
