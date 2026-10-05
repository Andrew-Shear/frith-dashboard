/**
 * This backend works as a reverse proxy for the frontend
 * This backend is required in order to avoid CORS issues
 * Otherwise I wouldn't have made it...
 */

import express from 'express'
import request from 'request'
import cors from 'cors'

import apiKeys from './rsc/api_keys.json' with { type: "json" };
import openHours from './rsc/openhours.json' with { type: "json" };
const canvas_api_key = apiKeys.canvas

const app = express()
app.use(express.json())

let groupIDs = []

const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true)
    },
}
app.options('*', cors(corsOptions))
app.use(cors())

app.use('/canvas-all', cors(corsOptions), (req, res) => {
    groupIDs = []
    // console.log("reset id list")
    const request_url = `https://vt.instructure.com/api/v1/appointment_groups/?access_token=${canvas_api_key}&include_past_appointments=true&scope=manageable&per_page=1000&page=1`
    req.pipe(request(request_url, function (error, response, body) {
        if (error !== null) {
            console.log("ERROR: canvas retrieval error")
            res.status(400).send({ message: 'error' })
        }
    })).pipe(res)
});

app.post('/canvas-set', (req, res) => {
    groupIDs.push(req.body.groupID)
    // console.log(`canvas appointment id set: ${groupIDs}`)
    res.send(req.body)
})

app.use('/canvas-get', (req, res) => {
    const groupID = groupIDs.pop()
    // console.log(`canvas appointment id requested, popped ${groupID}. id list: [${groupIDs}]`)
    const request_url = `https://vt.instructure.com/api/v1/appointment_groups/${groupID}?access_token=${canvas_api_key}&include_past_appointments=true&scope=manageable&per_page=1000&page=1`
    req.pipe(request(request_url, function (error, response, body) {
        if (error !== null) {
            console.log("ERROR: canvas retrieval error")
            res.status(400).send({ message: 'error' })
        }
    })).pipe(res)
})

app.get('/open-hours', cors(corsOptions), (req, res) => {
    res.json(openHours)
})


app.listen(3100, () => console.log("Hosted middleware on port 3100"))
