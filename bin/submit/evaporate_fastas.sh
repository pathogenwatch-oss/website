#!/usr/bin/env bash

# Run against a directory of FASTAs using:
# find [directory] -name "*.fa.gz" -print0 | xargs -0 -P [num_processes] -I xx ./evaporate_to_PW.sh xx > records.csv

# Assumes the config is in /data/spaces-config

#spaces_base_url="https://pathogenwatch-cgps.ams3.digitaloceanspaces.com/pw-test/fasta"
# URL for testing
spaces_base_url="s3://pathogenwatch-cgps/pw-test/fasta"

file="${1}"
ending="${2:-.fasta}"
config_dir="${3:-/data/spaces-config}"

checksum=$( zcat "${file}" | sha1sum | cut -f 1 -d ' ' )
name=$( basename "${file}" ${ending}.gz )
prefix=${checksum:0:2}
remote_url=${spaces_base_url}/${prefix}/${checksum}.gz
docker run --rm -ti -v "${config_dir}":/root/.aws:Z amazon/aws-cli --endpoint=https://ams3.digitaloceanspaces.com/ s3 cp "${1}" "${remote_url}" 1>&2
echo "${name},${checksum}"
