import express from 'express'
import alexa from './workflows/alexa_workflow.js'
import twilio from 'twilio'
import PatientDB from './schemas/patientDB.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { relay } from '@relaypro/sdk'
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
  twiml.say({ voice: 'alice' }, `A ${data.nurse_name} will be available shortly ${data.name}.`)

  // Render the response as XML in reply to the webhook request
  res.type('text/xml')
  res.send(twiml.toString())
  console.log("done processing")
})

function get_patient_info(caller_number) {
  patientDB = {}
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



// Create an HTTP server and listen for requests on port 3000
const server = _server.listen(port, function() {
    console.log("Web server listening on port: " + port)
})

const app = relay({server})
app.workflow(`alexa`, alexa)