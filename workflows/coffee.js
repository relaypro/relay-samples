import pkg from '@relaypro/sdk'
const { Event, Taps, Button, createWorkflow, Uri } = pkg


export default createWorkflow(relay=> {
  relay.on(Event.START, async(event) => {
    const { trigger: { args: { source_uri } } } = event
    relay.startInteraction([source_uri], 'coffee')
  })

  relay.on(Event.INTERACTION_STARTED, async({source_uri: interaction}) => {
    try {
      const deviceName = Uri.parseDeviceName(interaction)

      await relay.say(interaction, `Getting recipies for ${deviceName}`)
      await relay.say(interaction, `Which drink would you like help with?`)
      const drink = await relay.listen(interaction, ['Latte','Frappuccino'])
      await relay.say(interaction, `Preparing the recipe for a ${drink.text}`)
      if (drink.text === 'Frappuccino') {
        await relay.say(interaction, 'Blend ice, 10 ounces Milk, and a shot of espresso. Single tap when blended')
      }
    } catch (e) {
      console.error(e)
    } 
  })

  relay.on(Event.BUTTON, async ({ source_uri: interaction }) => {
    console.log('INTERACTION URI: ' + interaction)
    await relay.say(interaction, 'Next, top with whipped cream and chocolate drizzle.  Order complete')
    await relay.terminate()
  })
})