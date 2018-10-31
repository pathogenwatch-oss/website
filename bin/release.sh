#!/bin/bash
set -e

LEVEL=${1:-"minor"}

echo Creating new $LEVEL release...

npm run build

git add public views monitor.json assets.json
git commit -m "Build" --allow-empty

npm version $LEVEL
git push && git push --tags
