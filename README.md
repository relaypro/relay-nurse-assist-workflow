# Relay nurse assist workflow integrated with Alexa

The idea behind it: Patients have Alexas. Nurses have Relays. A patient should be able to request assistance from an alexa which would then notify a nurse on their relay.

How it works: A patient would be able to speak "call my nurse" on the alexa. This goes through Twilio's voice API and hits an endpoint on our express server. Based off the Alexa's number, the server is able to select the assigned nurse for that patient and initiate a workflow on that nurse's device. On the nurse's relay, it will notify the nurse of the patient's name and room number and will then give an option to either repeat the request or acknowledge it. Once acknowledged, it will notify the patient via alexa that the nurse has acknowledged the request.

## Simplified Workflow Architecture
![architecture diagram](https://github.com/relaypro/relay-alexa-workflow/blob/master/assets/arch-diagram.png)
### Paths
`/voice` This is the endpoint that Twilio hits when it recieves a phone call

`/stall` This is the url that redirects until it recieves a response from a relay. The purpose of this is to stall the call so twilio does not end the call on the alexa

## Installation

clone the repository: 

```bash
git clone https://github.com/relaypro/relay-golf-assist.git
```

Make sure you have NodeJS installed, or download it from [NodeJS](https://nodejs.org/en/download/)

Run the following to make sure all relevant libraries and packages are installed:
```bash
npm install
```


## Local Usage (for testing purposes only)

There are a couple of environment variables. Create a .env file by running `touch .env` and place the variables and their values in the .env file.
Eg. 
```python
MONGODB_URI=<input>
RELAY_ID=<input>
RELAY_WF_ID=<input>
SAMPLE_NUMBER=<input>
IBOT_ENDPOINT=<input>
CLIENT_ID=<input>
OAUTH_ENDPOINT=<input>
TOKEN=<input>
SUBSCRIBER_ID=<input>
TOKEN_USERNAME=<input>
TOKEN_PASS=<input>
```

Register a workflow on your Relay device by

```bash
relay workflow:create --type=http --uri=wss://relay-alexa.herokuapp.com/alexa --name nurse-assist <device_id>
```

To run the application: 
```bash
npm start
```

## Built with
![technology stack](https://github.com/relaypro/relay-alexa-workflow/blob/master/assets/stack.png)

## License
[MIT](https://choosealicense.com/licenses/mit/)

