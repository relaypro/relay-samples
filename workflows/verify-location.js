import pkg from '@relaypro/sdk'
const { Event, createWorkflow, Uri } = pkg

export default createWorkflow(relay => {
  relay.on(Event.START, async (event) => {
    const { trigger: { type, args: { spillover, source_uri: originator } } } = event
    console.log(`start`, { type, spillover })
    if (type !== `phrase` || !spillover) {
      await relay.terminate()
    } else {
      await relay.setVar(`spillover`, spillover)
      await relay.startInteraction([originator], `location`)
    }
  })

  relay.on(Event.INTERACTION_STARTED, async ({ source_uri: interaction }) => {
    try {
      const name = Uri.parseDeviceName(interaction)
      const spokenLocation = await relay.getVar(`spillover`)
      await relay.sayAndWait(interaction, `Verifying if ${name} is in location ${spokenLocation}`)
      const indoorLocation = await relay.getDeviceIndoorLocation(interaction, true)
      await relay.sayAndWait(interaction, `The device's indoor location is ${indoorLocation}`)
    } catch (err) {
      console.error(`failed to fetch location`, err)
    } finally {
      await relay.terminate()
    }
  })

})
