import pkg from '@relaypro/sdk'
const { Event, createWorkflow, Uri } = pkg

export default createWorkflow(relay => {
  relay.on(Event.START, async (event) => {
    const { trigger: { args: { source_uri } } } = event
    relay.startInteraction([source_uri], `device name`)
  })

  relay.on(Event.INTERACTION_STARTED, async ({ source_uri }) => {
    const deviceNameFromUri = Uri.parseDeviceName(source_uri)
    const deviceNameFromServer = await relay.getDeviceName(source_uri)
    if (deviceNameFromUri !== deviceNameFromServer) {
      await relay.sayAndWait(source_uri, `${deviceNameFromUri} and ${deviceNameFromServer} are not the same`)
    } else {
      await relay.sayAndWait(source_uri, `This interaction's device name, ${deviceNameFromUri}, can be obtained two ways`)
      const location = await relay.getDeviceLocation(source_uri)
      await relay.sayAndWait(source_uri, `The device is located at the following street address ${location}`)
    }

    await relay.terminate()
  })
})
