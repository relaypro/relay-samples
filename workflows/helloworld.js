import pkg from '@relaypro/sdk'
const { Event, createWorkflow, Uri } = pkg

export default createWorkflow(relay => {
  relay.on(Event.START, async (event) => {
    const { trigger: { args: { source_uri } } } = event
    relay.startInteraction([source_uri], `hello world`)
  })

  relay.on(Event.INTERACTION_STARTED, async ({ source_uri }) => {
    const deviceName = Uri.parseDeviceName(source_uri)
    console.log(`interaction start ${source_uri}`)
    await relay.sayAndWait(source_uri, `What is your name ?`)
    const { text: userProvidedName } = await relay.listen(source_uri)
    const greeting = await relay.getVar(`greeting`)
    await relay.sayAndWait(source_uri, `${greeting} ${userProvidedName}! You are currently using ${deviceName}`)
    await relay.terminate()
  })
})
