import { relay } from '@relaypro/sdk'
import helloworld from './workflows/helloworld.js'
import deviceinfo from './workflows/deviceinfo.js'
import interval from './workflows/interval.js'
import notification from './workflows/notification.js'
import vibrate from './workflows/vibrate.js'
import coffee from './workflows/coffee.js'
import timer from './workflows/timer.js'
import axios from 'axios'
import querystring from 'querystring'
import express from 'express'

export const wfs = []

const express1 = express()
const port = process.env.PORT || 3000

express1.post('/msg', (req, res) => {
  console.log(`Request to /msg`)
  
  let data = req.body

  eventEmitter.emit(`http_event`, data)

  res.send("Received")
})

const server = express1.listen(port, () => {
  console.log(`express listening on ${port}`)
})

const app = relay({server})

// "named" workflows must match the WS path
// e.g. wss://host:port/helloworld
app.workflow(`helloworld`, helloworld)
app.workflow(`deviceinfo`, deviceinfo)
app.workflow(`interval`, interval)
app.workflow(`notification`, notification)
app.workflow(`vibrate`, vibrate)
app.workflow(`coffee`, coffee)
app.workflow(`timer`, timer)


// only one "un-named" workflow allowed...
// e.g. wss://host:port/
// e.g. wss://host:port
// enabled by setting ENV parameter:
// STRICT_PATH=1 node index.js
app.workflow(relay => {
  relay.on(`start`, async () => {
    relay.say(`This is a default workflow`)
    relay.terminate()
  })
})
