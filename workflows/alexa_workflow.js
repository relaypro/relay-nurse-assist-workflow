import twilio from 'twilio'
import PatientDB from '../schemas/patientDB.js'
import dotenv from 'dotenv'
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_ID
const authToken = process.env.TWILIO_AUTH_TOKEN
const from_number = process.env.TWILIO_NUMBER

const createApp = (relay) => {
    console.log("app is hosted and running")
    let text
    let name
    let room

    relay.on(`start`, async () => {
        name = await relay.getVar(`name`)
        room = await relay.getVar(`room`)
        terminating_id = await relay.getDeviceId()
        state = 0
        console.log(room)
        text = `${name} is requesting assistance at room ${room}`
        await relay.say(text)
        await relay.say(`single tap to hear the request again`)
        await relay.say(`double tap to acknowledge`)
    })

    relay.on(`button`, async (button, taps) => {
        console.log("button clicked")
        console.log(button)
        if (button.button === `action`) {
            console.log("action button")
            if (button.taps === `single`) {
                await relay.say(text)
            } else if (button.taps === `double`) { 
                await relay.say("Request acknowledged")
                await relay.terminate()
            }
        }
    })
}

export default createApp