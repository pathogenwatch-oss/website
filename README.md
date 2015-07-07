# WGSA Web Server

Node.js code for WGSA. Works together with [WGSA Web Client](https://github.com/ImperialCollegeLondon/wgst-web-client).

## Getting started

1. Install Node dependencies:

  `npm install`

2. Copy config file:

  `cp example.config.json config.json`

3. Modify the config file as needed.

4. Run application:

  with the default _development_ environment:

  `npm start`

  or specify the required environment:

  `NODE_ENV=production npm start`

5. Navigate to `http://localhost` or `http://wgsa.net` in your latest version of Chrome browser.

## Monitoring

Via `pm2` - https://github.com/Unitech/pm2 

  `npm run pm2`

## Running Tests

* Unit tests

  `npm test`

* End-to-end tests

  `npm run e2e`

## Deprecation warning

This repository stores Node.js code and the client side code that can be found in `private` directory. The client side code is soon to be deprecated and replaced with [WGSA Web Client](https://github.com/ImperialCollegeLondon/wgst-web-client). Be aware of that before commiting to `private` directory.

## Supported FASTA file extensions

* .fa
* .fas
* .fna
* .ffn
* .faa
* .frn
* .contig

## Troubleshooting

When the node app runs as expected, but the page doesn't look/work as expected then it's very likely that your browser serves cached (i.e. old) js/css files. To validate, open Incognito Window in Chrome or disable cache in Chrome Developer Tools (Cmd + Alt + I > Settings > Disable cache) and reload your page.

If that didn't help, check if you get JS error in Chrome Developer Tools Console (Cmd + Alt + J).

## Client side related development notes

`.wgst--hide-this` class uses `display: none;` - can not render `canvas` when it's parent element is not displayed.

`.wgst--invisible-this` class uses `visibility: hidden;` - can render `canvas` when it's parent element is invisible.

### UI Logic

#### 1. Containers

There are 3 types of containers:
1. Container - top level class of containers.
2. Fullscreen - maximised container.
3. Panel - minimised container.

Other types (yet to be defined):
1. Overlay - container on top of all other containers.
2. Background - container underneath of all other containers.

Containers are controlled via hidables. Each container has its own hidable. All other container controls are aliases and internally should trigger hidable controls.

#### 2. Hidables

Hidables represent containers state. Hidables are created and destroyed with containers. Each container comes with a single hidable. When hidable is created it is displayed on the sidebar. Hidables allow to manipulate containers.

Hidables must not be created/removed directly. They can be manipulated only by manipulating containers.
