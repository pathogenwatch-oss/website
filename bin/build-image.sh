#!/usr/bin/env bash
set -e

if [ $# -eq 0 ]; then
  echo "No tag supplied, using version in package.json as a tag"
fi

tag=${1:-"registry.gitlab.com/cgps/wgsa-middle-end:v$(yaml get package.json version)"}

npm install --production --ignore-scripts

echo Building docker image $tag

docker build --build-arg http_proxy=$http_proxy --build-arg https_proxy=$https_proxy -t $tag .

echo Pushing docker image $tag

docker push $tag
