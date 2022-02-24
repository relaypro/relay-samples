import { relay } from '@relaypro/sdk'
import helloworld from './workflows/helloworld.js'
import deviceinfo from './workflows/deviceinfo.js'
import interval from './workflows/interval.js'
import verifyLocation from './workflows/verify-location.js'
import broadcast from './workflows/broadcast.js'
import vibrate from './workflows/vibrate.js'

const app = relay({
    subscriberId: `6aa4cf8f-cb49-483b-aca8-80b01a4c1e25`,
    apiKey: `447e27bc111b4787eb7f48a239eda352`,
})

// const device = await app.api.fetchDevice(`990007560004928`)

// console.log(`device`, device)

// "named" workflows must match the WS path
// e.g. ws://host:port/helloworld
app.workflow(`helloworld`, helloworld)
app.workflow(`deviceinfo`, deviceinfo)
app.workflow(`interval`, interval)
app.workflow(`verify-location`, verifyLocation)
app.workflow(`broadcast`, broadcast)
app.workflow(`vibrate`, vibrate)
// app.workflow(`coffee`, coffee)
//app.workflow(`timer`, timer)

// only one "un-named" workflow allowed...
// e.g. wss://host:port/
// e.g. wss://host:port
// enabled by setting ENV parameter:
// STRICT_PATH=1 node index.js
// app.workflow(relay => {
//   relay.on(`start`, async () => {
//     relay.say(`This is a default workflow`)
//     relay.terminate()
//   })
// })
