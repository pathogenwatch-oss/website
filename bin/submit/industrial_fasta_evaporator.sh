in_dir=${1:-.}
out_dir=${2:-Converted}

echo "Preparing FASTAs from '${in_dir}' in '${out_dir}'"

mkdir -p "${out_dir}"

for file in "${in_dir}"/*.gz; do
  checksum=$(zcat "${file}" | sha1sum | cut -f 1 -d ' ')
  name=$(basename "${file}" ${ending}.gz)
  prefix=${checksum:0:2}

done
