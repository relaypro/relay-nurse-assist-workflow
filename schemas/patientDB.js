import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()

const uri = process.env.MONGODB_URI
mongoose.connect(uri, {useNewUrlParser: true})
const relayPatientSchema = {
    name: String,
    room: String,
    relay_id: String,
    relay_wf_id: String,
    nurse_name: String
}
const PatientDB = mongoose.model("relaypatient", relayPatientSchema, 'relaypatient')
export default PatientDB