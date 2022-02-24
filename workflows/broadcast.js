import pkg from '@relaypro/sdk'
const { Event, createWorkflow, Uri } = pkg

const BROADCAST_NAME = `broadcast_alert`

export default createWorkflow(relay => {
  relay.on(Event.START, async (event) => {
    const [targets, text, confirm] = await relay.get([`targets`, `text`, `confirmation_required`])
    const actualTargets = targets.split(`,`).map(Uri.deviceName)
    console.log(`broadcast workflow targets`, actualTargets)
    if (confirm) {
      await relay.alert(BROADCAST_NAME, text, actualTargets)
    } else {
      await relay.broadcast(actualTargets, text)
    }
    await relay.terminate()
  })

})
