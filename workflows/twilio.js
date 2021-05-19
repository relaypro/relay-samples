import {wfs, eventEmitter} from './index.js'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const from_number = process.env.TWILIO_FROM_NUMBER
let name = ''

import twilio from 'twilio'

const client = new twilio(accountSid, authToken)



function send_text(message, to_number){
  client.messages
        .create({
           body: message,
           from: from_number,
           to: to_number
         })
        .then(message => console.log(message.sid));
}    
  

const createApp = (relay) => {
  let message = ''
  let stripped_number = relay.getVar(`number`)
  let number = relay.getVar(`number`) 
  let new_message = true
  relay.on(`start`, async () => {
    await relay.say(`Who would you like to text?`)
    const get_number = await relay.listen('$FULLPHONENUM')
    number = get_number.text
    stripped_number = number.replace(/-/g,"")
    console.log(`phone number is ${number}`)
    await relay.say(`What is ${number}'s name?`)
    name = await relay.listen(["iPhone", "Leena", "Ibraheem"])
    name = get_number
    await relay.say(`Tap once to send ${name} a message. Double tap to exit`)
    wfs[`+1${stripped_number}`] = relay
  })    
    
  relay.on(`button`, async (button, taps) => {
    if (button === `action`) {
      if (taps === `single`) {
        if ( new_message ) {
          new_message = false
          await relay.say(`Press and hold to record your message`)
          message = await relay.listen()
          await relay.say(`Message is: ${message}`)
          await relay.say(`Tap once to send. Double tap to exit`)
	      } else if ( !new_message ) {
          new_message = true
          console.log(`Sending to: ${number}`)
          await send_text(`+1${stripped_number}`, message)
          await relay.say(`Message sent.`)
          message = ''
        }
      } else if (taps === `double`) { 
        await relay.say(`Goodbye`)
        await send_text(`+1${stripped_number}`, `Relay+ has ended the conversation`)
        await relay.terminate()
      }
    }
  })
  
  eventEmitter.on(`http_event`, async (text) => {
    console.log(`got http event`)
    console.log(`http_event received ${text}`)
    await relay.say(`${name} responded with ${text}`)
    await relay.say(`Tap once to reply.`)
  })
}

export default createApp
