
import pkg from '@relaypro/sdk'
const { Event, createWorkflow, Uri } = pkg

export default createWorkflow(relay => {
  relay.on(Event.START, async (event) => {
    const { trigger: { args: { source_uri: originator } } } = event
    await relay.setVar(`tick_num`, 1)
    await relay.startTimer(await relay.getNumberVar(`interval`, 60))
    await relay.startInteraction([originator], `interval timer`)
  })

  relay.on(Event.INTERACTION_STARTED, async ({ source_uri: interaction }) => {
    await relay.setVar(`active_interaction`, interaction)
    await relay.sayAndWait(interaction, `starting timer`)
  })

  relay.on(Event.TIMER, async () => {
    let num = await relay.getNumberVar(`tick_num`)
    let count = await relay.getNumberVar(`count`, 5)
    let interaction = await relay.getVar(`active_interaction`)

    console.log(`timer event`, { num, count })

    if (count <= num) {
      await relay.sayAndWait(interaction, `stopping timer`)
      await relay.terminate()
    } else {
      await relay.sayAndWait(interaction, `${num}`)
      await relay.setVar(`tick_num`, ++num)
    }
  })

  relay.on(Event.BUTTON, async ({ source_uri, button, taps }) => {
    console.log(`button event`, { source_uri, button, taps })
    if (button === `action` && taps === `single`) {
      await relay.sayAndWait(source_uri, `stopping timer`)
      await relay.terminate()
    } else {
      await relay.sayAndWait(source_uri, `dude ! stop pressing buttons`)
    }
  })

})
