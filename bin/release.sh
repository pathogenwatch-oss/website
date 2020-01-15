#!/bin/bash
set -e

LEVEL=${1:-"minor"}

echo Creating new $LEVEL release...

yarn build

git add public views assets.json records.json
git commit -m "Build" --allow-empty

npm version $LEVEL # `yarn version` works differently
git push && git push --tags
