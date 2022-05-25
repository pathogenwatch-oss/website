# Usage: <relative path to input directory of FASTAs> <relative path tp output FASTAs> <optional --dryrun>
in_dir=${1}
out_dir=${2}
dry_run=${3}
ending=.fasta
config_dir=/data/spaces-config
spaces_base_url="s3://pathogenwatch-cgps/pw-test/fasta"

echo "Preparing FASTAs from '${in_dir}' in '${out_dir}'"

for file in "${in_dir}"/*.gz; do
  checksum=$(zcat "${file}" | sha1sum | cut -f 1 -d ' ')
  name=$(basename "${file}" ${ending}.gz)
  prefix=${checksum:0:2}
  sub_dir="${out_dir}"/"${prefix}"
  if [ ! -d "${sub_dir}" ]; then
    mkdir -p "${sub_dir}"
  fi
  out_file="${sub_dir}/${checksum}.fa.gz"
  if [ ! -s "${out_file}" ]; then
    cp "${file}" "${out_file}"
  fi
  echo "${name},${checksum}"
done

podman run --rm -ti -v "${config_dir}":/root/.aws:z -v "$PWD/${out_dir}":/aws:z amazon/aws-cli --endpoint=https://ams3.digitaloceanspaces.com/ s3 sync "${dry_run}" /aws/ "${spaces_base_url}/" 1>&2
