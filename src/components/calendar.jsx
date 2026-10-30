/**
 * Fetches trainings from canvas and displays them in wee little windows
 */

import { useEffect, useState, useRef } from 'react'
import CalendarDay from './calendar-day'
import './css/calendar.css'

// const DEBUG_OFFSET = -365*3+30*3-12; //offset for class_old3
// const DEBUG_OFFSET = -8; //offset for class_ula
const DEBUG_OFFSET = 0;

const Calendar = ({ className, data, date, operatingHours }) => {
    const [appointments, setAppointments] = useState([])
    const ref = useRef();

    let closeTimes = []
    let openTimes = []
    try {
        closeTimes = operatingHours.map((d) => parseInt(d.close));
        openTimes = operatingHours.map((d) => parseInt(d.open));
    }
    catch (e) { }

    useEffect(() => {
        const slots = data.filter(e => e.appointment_group_id)
    setAppointments(sortByDays({ all: slots }, date, 3))
    }, [data, date])

    return (
        <div className={className} ref={ref} id="calendar-main">
            {
                appointments === undefined ?
                    <></>
                    :
                    appointments.map((trainings, index) =>
                        // console.log(trainings)
                        <CalendarDay
                            key={index}
                            className={`calendar-day blur ${index === 0 ? "" : "calendar-sub"}`}
                            dayIndex={(date.getDay() + index) % 7}
                            trainings={trainings}
                            date={date}
                            openTime={openTimes[(date.getDay() + index) % 7]}
                            closeTime={closeTimes[(date.getDay() + index) % 7]}
                        />
                    )
            }
            {/* <CalendarDay className="calendar-day blur" day={today.getDay()} trainings={appointments[0]} />
            <CalendarDay className="calendar-day calendar-sub blur" day={today.getDay() + 1} trainings={appointments[1]} />
            <CalendarDay className="calendar-day calendar-sub blur" day={today.getDay() + 2} trainings={appointments[2]} /> */}
        </div>
    )
}


/**
 * Returns a dictionary of all meetings belonging to a day
 * @param {*} data - appointments seperated by groupID
 * @param {*} numDays - number of days to look ahead
 * @param {*} today - today's date
 * @returns 
 */
const sortByDays = (data, today, numDays, TEST) => {
    const finalArray = Array.from(Array(numDays), () => new Array())
    const keys = Object.keys(data);

    keys.forEach((key, index) => {
        // console.log(data[key]);
        if (data[key].length) {
            data[key].forEach((e) => {
                // console.log(e.start_at)
                const test = new Date(e.start_at)
                // console.log(test.getTime())

                //iterate through day offsets, 0 to <numDays>
                for (const offset in [...Array(numDays).keys()]) {
                    //add the appointment to the proper day index, if applicable
                    if (isDate(test, today, parseInt(offset) + DEBUG_OFFSET)) {
                        finalArray[offset].push(e)
                    }
                }
            })
        }
    })

    return finalArray
}

/**
 * Check if two dates are on the same day, plus a given offset
 * @param {*} dateOther - date in question
 * @param {*} dateBaseline - date to compare against
 * @param {*} offsetDays - days of offset to apply to dateBaseline
 * @returns true if dateOther is on dateBaseline + offsetDays, false otherwise
 */
const isDate = (dateOther, dateBaseline, offsetDays = 0) => {
    const dateOffset = new Date(dateBaseline)
    dateOffset.setDate(dateOffset.getDate() + offsetDays)

    return dateOther.getDate() === dateOffset.getDate() &&
        dateOther.getMonth() === dateOffset.getMonth() &&
        dateOther.getYear() === dateOffset.getYear();
}

export default Calendar
