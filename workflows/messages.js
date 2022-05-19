import pkg from '@relaypro/sdk'
const { Event, createWorkflow, Uri } = pkg

const BROADCAST_NAME = `broadcast_alert`

export default createWorkflow(relay => {
    relay.on(Event.START, async (event) => {
        const { trigger: { args: { source_uri: originator } } } = event
        const count = await relay.getUnreadInboxSize(originator)
        await relay.broadcast(originator, originator, BROADCAST_NAME, text)
        await relay.terminate()
    })

})
