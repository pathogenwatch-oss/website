import sha1 from 'node-forge/lib/sha1';

export function hash(file) {
  const blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
  const fileReader = new FileReaderSync();
  const messageDigest = sha1.create().start();

  const MB = 1024 * 1024;
  const chunkSize = 0.5 * MB;
  const chunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 0;

  while (currentChunk < chunks) {
    const start = currentChunk * chunkSize;
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    const chunk = fileReader.readAsBinaryString(
      blobSlice.call(file, start, end)
    );
    messageDigest.update(chunk);
    currentChunk++;
    if (currentChunk % 100 === 0) {
      self.postMessage({
        file: file.name,
        progress: (currentChunk / chunks) * 100,
      });
    }
  }
  return messageDigest.digest().toHex();
}
