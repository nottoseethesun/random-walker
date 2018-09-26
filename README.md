# Random Robot Walker

Uses websocket to fetch position data for 'n' robots, and plots their path on the web browser.

## Prerequisites

* Back-end
* NodeJS and npm versions that meet requirements in `engines` field in `package.json`.
* Modern web browser

## Install

`npm i`

## Run

`npm start`

## Configure

See `dev/README.md`.

## To-Do

* Tests `npm test`
* See @to-do's in code
* Tighten lint: Add `tslint-microsoft-contrib` to tslint, plus their other recommended security settings; cyclomatic complexity to 12; allow function hoisting so that detail functions can be defined lower in the file, out of the way of the natural top-down understanding.
