import pkg from '@relaypro/sdk'
const { Event, Taps, Button, createWorkflow, NotificationOptions } = pkg

const createApp = (relay) => {
  relay.on(Event.START, async () => {
    try {
      const location = await relay.getDeviceAddress()
      console.log(location)
      await relay.say(`Getting recipies for ${location}`)
      await relay.say(`Are you preparing a Hot or cold drink?`)
      const temp = await relay.listen(['hot','cold'])
      await relay.say('What size?')
      const size = await relay.listen(['tall','grande', 'venti'])
      await relay.say(`Which drink would you like help with?`)
      const drink = await relay.listen(['strawberry funnel cake frappuccino','Mocha Cookie crumble'])
      console.log(size.text)
      if (drink.text === 'strawberry funnel cake Frappuccino') {
        await relay.say(`${size.text} - ${drink.text}`)
        await relay.say('blend Ice, 10 ounces Milk, 3 pumps funnel cake syrup. Single tap once complete')
      }
    } catch (e) {
      console.error(e)
    } 
  })    
    
  relay.on(Event.BUTTON, async (buttonEvent) => {
    console.log(buttonEvent.taps)
    console.log(buttonEvent.button)
    if (buttonEvent.button === Button.ACTION) {
      console.log(`action `)
      if (buttonEvent.taps === Taps.SINGLE) {
        console.log(`single `)
        await relay.say('next, top with whipped cream, strawberry drizzle and funnel cake topping.')
        await relay.terminate()
      } else if (buttonEvent.taps === Taps.DOUBLE) { 
        await relay.say(`Goodbye`)        
        await relay.terminate()
      }
    }
  })  
}
  
  export default createApp