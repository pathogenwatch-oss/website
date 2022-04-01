#!/usr/bin/env bash

spaces_base_url="s3://pathogenwatch-cgps/pw-live/fasta"

checksum="${1}"
prefix=${checksum:0:2}
remote_url=${spaces_base_url}/${prefix}/${checksum}.fa.gz
aws --endpoint=https://ams3.digitaloceanspaces.com/ s3 cp "${remote_url}" "${1}".fa.gz >> uploads.log
