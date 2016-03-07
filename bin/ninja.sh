#!/bin/bash

cp ./public/wgsa.js ../wgsa_middle-end/node_modules/wgsa_front-end/public
cd ../wgsa_middle-end/node_modules/wgsa_front-end
. ~/.nvm/nvm.sh
nvm use node
npm run config
