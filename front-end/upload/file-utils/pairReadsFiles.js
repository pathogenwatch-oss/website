import config from '~/app/config';

export default function pairReadsFiles(files, filenameRegex) {
  const pairs = {};
  const { maxSizeMB = 500 } = config.maxReadsFileSize;
  const maxSize = maxSizeMB * 1048576;
  for (const file of files) {
    if (file.size > maxSize) {
      throw new Error(
        `${file.name} is too large, the limit is ${maxSizeMB} MB.`
      );
    }
    const id = file.name.match(filenameRegex)[1];
    pairs[id] = pairs[id] || {};
    pairs[id][file.name] = file;
  }
  for (const [ id, pairedFiles ] of Object.entries(pairs)) {
    if (Object.keys(pairedFiles).length !== 2) {
      throw new Error(
        `No pair found for files starting ${id}, please check and try again.`
      );
    }
  }
  return pairs;
}
