#!/bin/bash

git fetch
git checkout $1
git pull
cp ./public/*.js ../wgsa_middle-end/node_modules/wgsa_front-end/public
cd ../wgsa_middle-end/node_modules/wgsa_front-end
. ~/.nvm/nvm.sh && nvm use node
npm run config
