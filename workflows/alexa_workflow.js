import twilio from 'twilio'
import dotenv from 'dotenv'
import EventEmitter from 'events'
dotenv.config()

export const eventEmitter = new EventEmitter() 
const createApp = (relay) => {
    console.log("app is hosted and running")
    let text
    let name
    let room

    relay.on(`start`, async () => {
        console.log("does it get here")
        name = await relay.getVar(`name`)
        console.log(name)
        room = await relay.getVar(`room`)
        console.log(room)
        text = `${name} is requesting assistance at room ${room}`
        await relay.say(text)
        await relay.say(`single tap to hear the request again`)
        await relay.say(`double tap to acknowledge`)
    })

    relay.on(`button`, async (button, taps) => {
        console.log("button clicked")
        console.log(button)
        console.log(name)
        console.log(room)
        if (button.button === `action`) {
            console.log("action button")
            if (button.taps === `single`) {
                await relay.say(text)
            } else if (button.taps === `double`) { 
                await relay.say("Request acknowledged")
                eventEmitter.emit(`ack`, `ack`)
                await relay.terminate()
            }
        }
    })
}

export default createApp