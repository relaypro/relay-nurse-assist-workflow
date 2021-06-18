import express from 'express'
import alexa from './workflows/alexa_workflow.js'
import twilio from 'twilio'
import PatientDB from './schemas/patientDB.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { relay } from '@relaypro/sdk'
import axios from 'axios'
import qs from 'qs'
const VoiceResponse = twilio.twiml.VoiceResponse

/*
* Express server config
*/  
const port = process.env.PORT || 3000
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const _server = express()
_server.set('view engine', 'ejs')
_server.use(express.urlencoded({extended: true}))
_server.use(express.json())

// Create a route that will handle Twilio webhook requests, sent as an
// HTTP POST to /voice in our application
_server.post('/voice', (req, res) => {
  // Get information about the incoming call, like the city associated
  // with the phone number (if Twilio can discover it)
  const caller_number = req.body.From
  let data = get_patient_info(caller_number)
  // Use the Twilio Node.js SDK to build an XML response
  console.log(data)
  const twiml = new VoiceResponse()
  twiml.say({ voice: 'alice' }, `${data.nurse_name} will be available shortly ${data.name}. Thank you!`)
  send_notification(data.relay_id, data.relay_wf_id)
  // Render the response as XML in reply to the webhook request
  res.type('text/xml')
  res.send(twiml.toString())
  console.log("done processing")
})

function get_patient_info(caller_number) {
  let patientDB = {}
  let sample_from_number = process.env.SAMPLE_NUMBER
  patientDB[sample_from_number] = {
    name: "Jon Doe",
    room: "231",
    relay_id: process.env.RELAY_ID,
    relay_wf_id: process.env.RELAY_WF_ID,
    nurse_name: "jo jo"
  }

  let data = patientDB[caller_number]
  return data
}

/*
* This function initiates the workflow on the specified device_id
*/
async function send_notification(device_id, wf_id, name, room) {
  let access_token = await get_access_token()
  console.log("IN SEND_NOTIFICATION")
  const params = qs.stringify({
      'subscriber_id': process.env.SUBSCRIBER_ID,
      'user_id': device_id
  })
  let relay_wf_id = wf_id 
  try { 
      const response = await axios.post(`${ibot_endpoint}${relay_wf_id}?${params}`,
          {
              "action": "invoke",
              "action_args": {
                  "name": name,
                  "room": room
              }
          },
          { 
              headers : {
                  'Authorization': 'Bearer ' + access_token
              }
          })
      if (response.status == 200) {
          console.log(`Remote trigger invoked`)
          console.log(response.statusText)
      } else {
          console.log('something wrong happened within send_notification')
      }
  } catch (e) {
      console.error(e)
  }
}

/*
* This function generates an access token to hit the ibot API
*/
async function get_access_token() {
  let response = await axios({
      method: 'post',
      headers: {
          'content-type' : 'application/x-www-form-urlencoded', 
          'Authorization': `Basic ${process.env.TOKEN}`
      },
      url: process.env.OAUTH_ENDPOINT,
      data: qs.stringify({
          grant_type: 'password',
          client_id: process.env.CLIENT_ID,
          scope: 'openid',
          username: process.env.TOKEN_USERNAME,
          password: process.env.TOKEN_PASS
      }),
  })
  return response.data.access_token
}



// Create an HTTP server and listen for requests on port 3000
const server = _server.listen(port, function() {
    console.log("Web server listening on port: " + port)
})

const app = relay({server})
app.workflow(`alexa`, alexa)