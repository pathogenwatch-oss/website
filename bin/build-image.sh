#!/bin/bash
set -e

IMAGE_TAG=$1

npm install
docker build -t $IMAGE_TAG .
# docker push $IMAGE_TAG
