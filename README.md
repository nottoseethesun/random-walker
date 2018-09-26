# Random Robot Walker

Uses websocket to fetch position data for 'n' robots, and plots their path on the web browser.

## Performance

Works at 1 ms refresh rate with 1 robot, and at 20 ms refresh rate with 8 robots.  Works with 'n' robots.

## Special Features

Automatically picks a set of high-contrast colors, for 'n' robots, to make it easy to distinguish between the different paths of the robots.

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
