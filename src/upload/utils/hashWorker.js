import sha1 from 'node-forge/lib/sha1';

export function hash(file) {
  const blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice;
  const chunkSize = 1024 * 64;
  const chunks = Math.ceil(file.size / chunkSize);
  let currentChunk = 0;
  const fileReader = new FileReaderSync();
  const messageDigest = sha1.create().start();

  console.log('hashing...');
  while (currentChunk < chunks) {
    const start = currentChunk * chunkSize;
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize;
    const chunk = fileReader.readAsArrayBuffer(
      blobSlice.call(file, start, end)
    );
    const binaryString = String.fromCharCode.apply(null, new Uint8Array(chunk));
    messageDigest.update(binaryString);
    currentChunk++;
  }
  console.log('...digesting');
  return messageDigest.digest().toHex();
}
