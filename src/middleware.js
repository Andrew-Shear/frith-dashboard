/**
 * This backend works as a reverse proxy for the frontend
 */

import express from 'express'
import request from 'request'
import cors from 'cors'

import apiKeys from './rsc/api_keys.json' with { type: "json" };

const class_ula = "course_162912"; //test server
const class_production = "course_239650"; //frith F26

const class_id = class_production;

const app = express()
app.use(express.json())

const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true)
    },
}
app.options('*', cors(corsOptions))
app.use(cors())


// only need one api call to get the calendar events
app.use('/canvas-all', cors(corsOptions), (req, res) => {
    const start = new Date(); start.setHours(0, 0, 0, 0)
    const end = new Date(start); end.setDate(end.getDate() + 4)
    const request_url = `https://vt.instructure.com/api/v1/calendar_events?type=event&context_codes[]=${class_id}&start_date=${start.toISOString()}&end_date=${end.toISOString()}&per_page=100&access_token=${apiKeys.canvas}`
    req.pipe(request(request_url, function (error, response, body) {
        if (error !== null) {
	        console.log(error)
            console.log("ERROR: canvas retrieval error")
            if (!res.headersSent) res.status(400).send({ message: 'error' })
        }
    })).pipe(res)
});


app.listen(3100, () => console.log("Hosted middleware on port 3100"))

//============================================================================

// API endpoint output structure:
/*
[
    // one individual appointment
    {
        ...
        "id": <id number>,
        "start_at": <start Date in ISO 8601 extended format>,
        "end_at": <start Date in ISO 8601 extended format>,
        "title": <title String>,
        "available_slots": <empty slots number>,
        "participants_per_appointment": <total slots number>,
        "child_events": [
          <list of individual participant slots with names of students signed up, if we ever care about that>
        ]
    },
    ...
]

 */
