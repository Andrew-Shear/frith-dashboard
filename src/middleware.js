/**
 * This backend works as a reverse proxy for the frontend
 * This backend is required in order to avoid CORS issues
 * Otherwise I wouldn't have made it...
 */

import express from 'express'
import request from 'request'
import cors from 'cors'

import apiKeys from './rsc/api_keys.json' with { type: "json" };

const app = express()
app.use(express.json())

const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true)
    },
}
app.options('*', cors(corsOptions))
app.use(cors())

app.use('/canvas-all', cors(corsOptions), (req, res) => {
    const start = new Date(); start.setHours(0, 0, 0, 0)
    const end = new Date(start); end.setDate(end.getDate() + 4)
    const request_url = `https://vt.instructure.com/api/v1/calendar_events?type=event&context_codes[]=course_239650&start_date=${start.toISOString()}&end_date=${end.toISOString()}&per_page=100&access_token=${apiKeys.canvas}`
    req.pipe(request(request_url, function (error, response, body) {
        if (error !== null) {
	        console.log(error)
            console.log("ERROR: canvas retrieval error")
            if (!res.headersSent) res.status(400).send({ message: 'error' })
        }
    })).pipe(res)
});


app.listen(3100, () => console.log("Hosted middleware on port 3100"))
