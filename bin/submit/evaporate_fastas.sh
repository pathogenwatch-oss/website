#!/usr/bin/env bash

# Run against a directory of FASTAs using:
# find . -name "*.fasta.gz" -print0 | xargs -0 -P 2 -I xx /data/evaporate_fastas.sh xx > /data/p_aeruginosa_records.csv

# Assumes the config is in /data/spaces-config

#spaces_base_url="https://pathogenwatch-cgps.ams3.digitaloceanspaces.com/pw-test/fasta"
# URL for testing
spaces_base_url="s3://pathogenwatch-cgps/pw-live.fa/fasta"

file=$(basename "${1}")
ending="${2:-.fasta}"
config_dir="${3:-/data/spaces-config}"

checksum=$(zcat "${file}" | sha1sum | cut -f 1 -d ' ')
name=$(basename "${file}" ${ending}.gz)
prefix=${checksum:0:2}
remote_url=${spaces_base_url}/${prefix}/${checksum}.fa.gz
podman run --rm -ti -v "${config_dir}":/root/.aws:z -v $PWD:/aws:z amazon/aws-cli --endpoint=https://ams3.digitaloceanspaces.com/ s3 cp /aws/"${file}" "${remote_url}" 1>&2
echo "${name},${checksum}"
