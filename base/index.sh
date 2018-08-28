#!/usr/bin/env bash
set -e

docker build \
  --build-arg http_proxy=$http_proxy  \
  --build-arg https_proxy=$https_proxy \
  --build-arg HTTP_PROXY=$http_proxy  \
  --build-arg HTTPS_PROXY=$https_proxy \
  -t registry.gitlab.com/cgps/wgsa-middle-end/base:v4 \
  -f ./base/Dockerfile \
  ./base

docker push registry.gitlab.com/cgps/wgsa-middle-end/base:v4
