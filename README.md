# Frith Print Queue (and other stuff) Front End

## How It Works
The dashboard is hosted as a web page on `localhost:8000` that's run on one of the Raspberry Pis stored inside the sign-in kiosk. It is split into panels that show the 3D print queue, the current time & open/closing hours & lab attendance, and a calendar of upcoming trainings. The page makes the API and fetch calls every minute to refresh itself.
 
The data comes from three places: the print queue comes from a google Apps Script that returns the current list of prints, attendance comes from an http server run on the kiosk's Pi, and the training schedule comes from `src/middleware.js`, which makes an API call to Canvas. The middleware exists because Canvas requires an API key that we don't want to expose publicly. Open hours are read from `src/rsc/openhours.json`.

## Linux Package Requirements
* npm: 9.2.0
* unclutter: any version

## Code Structure

The code for the dashboard is split into two main parts:

- The main part of the code is for the frontend: it is what displays to the user.
- The secondary part is the backend (`src/middleware.js`). This runs in the backround and queries Canvas to get info about trainings.

### Frontend

The frontend is written in React.js, and the structure is as follows:

- **`frith-dashboard`**: the root folder.
  - **`dist`**: once the code is compiled to html it goes here. `index.html` is the main file to open in this, it should load everything.
  - **`node_modules`**: Ignore this. It's just where any necessary packages get downloaded to.
  - **`public`**: Just holds the Frith logo to be used by the dash.
  - **`src`**: Where all the good stuff is. This contains files for each segment of the dashboard and all the necessary helper files.
    - **`assets`**: Contains all pictures used. The background, no wifi symbol, and extra unused stuff.
    - **`components`**: The main parts of the dashboard are here.
    - **`rsc`**: Configuration options for the dashboard, includes open hours and API key.
    - **`App.jsx`**: The main thing that is shown. It uses all the main subcomponents and set them up and get data from the API.
  - **`README.md`**: This file.

#### What do the components all do?

- `attendance.jsx`: Shows the number of students in the lab. Data sent from `App.jsx`.
- `calendar-day.jsx`: One of the day columns with training and stuff on it.
- `calendar-item.jsx`: One of the training within the calendar day.
- `calendar.jsx`: Makes 3 calendar days (2 of them small) and populates their trainings.
- `clock.jsx`: Shows the current time and opening/closing time (depending on if we are currently open or not).
- `frith-logo.jsx`: Just an SVG of our logo. Currently unused.
- `pad-zeros-func.js`: Create a string from a number with a set amount of decimal places.
- `print-item.jsx`: One of the items in the print queue. Shows number with time remaining.
- `printing-list.jsx`: Shows the list of prints that are currently running.
- `queue-key.jsx`: Shows what the colors mean in the print queue.
- `queue-list.jsx`: Shows prints that are waiting to be approved or started.

### Backend

`src/middleware.js` has all the code for this. It creates a simple local REST API for getting calendar information from Canvas.


## How-To (Run in Chrome and configure pi settings)

### Setup Files

```bash
git clone https://github.com/Andrew-Shear/frith-dashboard.git
cd frith-dashboard
npm i
npm run build
```

Note: You need to re-run `npm run build` every time you alter the front-end.

### Add your Canvas API key

* API keys are not stored in this repository, but are required to fetch the FRITH training schedule.
* To add your key, first make a new file: `./src/rsc/api_keys.json`
* Then, copy the following to that file and fill in your API key:

```bash
{
    "canvas": "YOUR_API_KEY_HERE"
}
```

### Start middleware

```bash
cd src
node middleware.js
```

### Start frontend

```bash
cd frith-dashboard/dist
python3 -m http.server 8000
```

### Boot chrome

```bash
chromium-browser --kiosk http://localhost:8000
```

## How-To (Bare minimum or debugging)

### Autostart on Pi

For some reason starting programs on bootup changes with like every version of Rasbperry Pi OS so this is the current way. If it changes again, please edit this file:

Edit `/etc/xdg/labwc/autostart`, each line is a new process that runs when the Pi is started up.

Right now, it just opens a terminal and runs the `frith_start.sh` script.

### Edit Canvas class

We make a new Canvas course every year. To change which course we get the trainings for on the dashboard:

1. Go to `src/middleware.js`.
2. At the top, change the `class_production` variable to the id of the class. You can find the number in the url of the page.

### Edit Canvas API key

If the lab manager's API key changes, edit `src/rsc/api_keys.json` with the new one.

### Edit the open hours

If we change our hours edit `src/rsc/openhours.json` with the new hours.

## Other stuff

### Schedule a restart and remove mouse cursor after 10 seconds

```bash
sudo shutdown -r 8:00
unclutter -idle 10
```

### Disable screen sleeping

```bash
xset s off
xset -dpms s off
xset dpms 0 0 0
```
