#!/usr/bin/env bash

spaces_base_url="s3://pathogenwatch-cgps/pw-live/analysis"

taxid="${1}"
checksum="${2}"
subdir="${3}"
prefix=${checksum:0:2}

remote_url=${spaces_base_url}/cgmlst/${subdir}/${prefix}/${checksum}-${taxid}.json.gz
aws --endpoint=https://ams3.digitaloceanspaces.com/ s3 cp "${remote_url}" "${checksum}".json.gz >> downloads.log
