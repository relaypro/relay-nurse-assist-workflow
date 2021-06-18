import twilio from 'twilio'
import SmsDB from '../schemas/PatientDB.js'
import dotenv from 'dotenv'
dotenv.config()

const accountSid = process.env.TWILIO_ACCOUNT_ID
const authToken = process.env.TWILIO_AUTH_TOKEN
const from_number = process.env.TWILIO_NUMBER

const createApp = (relay) => {
    console.log("app is hosted and running")
    let text
    let session_id
    let state
    let terminating_id
    let name
    let cart_number

    relay.on(Event.START, async () => {
        relay.alert(`pga`,`trigger recieved.`,[`<your_relay_id>`])
    })

    relay.on(`start`, async () => {
        text = await relay.getVar(`text`)
        session_id = await relay.getVar(`session_id`)
        name = await relay.getVar(`name`)
        cart_number = await relay.getVar(`cart_number`)
        terminating_id = await relay.getDeviceId()
        state = 0
        console.log("session ID from within workflow: " + session_id)
        console.log(text)
        await relay.say(`Pickup requested at ${text} 
            tap once to accept, double tap to reject
        `)
    })

    relay.on(`button`, async (button, taps) => {
        server_url = process.env.SERVER_URL
        console.log("button clicked")
        console.log(button)
        let session_id = await relay.getVar(`session_id`)
        if (button.button === `action`) {
            console.log("action button")
            if (button.taps === `single`) {
                if (state === 0) {
                    await relay.say("pickup request accepted")
                    state = 1
                    await axios.post(`${server_url}/request/stage/${state}/${session_id}`,
                        {
                            name: name,
                            cart_number: cart_number
                        }
                    )
                } else if (state === 1) {
                    await relay.say("drop off request completed")
                    state = 2
                    await axios.post(`${server_url}/request/stage/${state}/${session_id}`,
                        {
                            name: name,
                            cart_number: cart_number,
                            device_id: terminating_id
                        }
                    )
                    await relay.terminate()
                }

            } else if (button.taps === `double`) { 
                if (state === 0) {
                    await relay.say(`Request terminated`)
                    await axios.post(`${server_url}/request/reject/${session_id}`,
                        {
                            device_id: terminating_id,
                        }
                    )
                    await relay.terminate()
                } else {
                    await relay.say(`Pickup requested at ${text}`)
                }
            }
        }
    })
}

export default createApp