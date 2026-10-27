# Frith Print Queue (and other stuff) Front End

## How It Works
The dashboard is hosted as a web page on `localhost:8000` that's run on one of the Raspberry Pis stored inside the sign-in kiosk. It is split into panels that show the 3D print queue, the current time & open/closing hours & lab attendance, and a calendar of upcoming trainings. The page makes the API and fetch calls every minute to refresh itself.
 
The data comes from three places: the print queue comes from a google Apps Script that returns the current list of prints, attendance comes from an http server run on the kiosk's Pi, and the training schedule comes from `src/middleware.js`, which makes an API call to Canvas. The middleware exists because Canvas requires an API key that we don't want to expose publicly. Open hours are read from `src/rsc/openhours.json`.

## Linux Package Requirements
* npm: 9.2.0
* unclutter: any version

## How-To (Run in Chrome and configure pi settings)
Setup Files
```
git clone https://github.com/ColtonTshudy/frith-printqueue-frontend/
cd frith-queue-frontend
npm i
npm run build
```

Add your Canvas API key
* API keys are not stored in this repository, but are required to fetch the FRITH training schedule
* To add your key, first make a new file: `./src/rsc/api_keys.json`
* Then, copy the following to that file and fill in your API key:
```
{
    "canvas": "YOUR_API_KEY_HERE"
}
```

Start middleware (reverse proxy program)
```
cd src
node middleware.js
```

Start frontend
```
cd frith-dashboard/dist
python3 -m http.server 8000
```

Boot chrome
```
chromium-browser --kiosk http://localhost:8000
```

## How-To (Bare minimum or debugging)
```
cd frith-queue-frontend
npm i
npm run dev
```

## Other stuff
Schedule a restart and remove mouse cursor after 10 seconds
```
sudo shutdown -r 8:00
unclutter -idle 10
```

Disable screen sleeping
```
xset s off
xset -dpms s off
xset dpms 0 0 0
```
