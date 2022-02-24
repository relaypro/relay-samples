import pkg from '@relaypro/sdk'
const { Event, createWorkflow, Uri } = pkg

export default createWorkflow(relay => {
  relay.on(Event.START, async (event) => {
    const { trigger: { args: { source_uri: originator } } } = event
    await relay.startInteraction([originator], `vibrate demo`)
  })

  relay.on(Event.INTERACTION_STARTED, async ({ source_uri: interaction }) => {
    await relay.sayAndWait(interaction, `This is a default vibrate pattern`)
    await relay.vibrate(interaction, [100, 500, 500,  500, 500, 500])
    await relay.terminate()
  })
})