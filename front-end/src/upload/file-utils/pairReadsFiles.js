export default function pairReadsFiles(files, filenameRegex, assemblerUsage) {
  const pairs = {};
  const { maxSizeMB = 500 } = assemblerUsage || {};
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
  if (assemblerUsage && Object.keys(pairs).length > assemblerUsage.remaining) {
    throw new Error(
      `You do not have enough remaining credits to complete this upload. You have ${assemblerUsage.remaining} left.`
    );
  }
  return pairs;
}
