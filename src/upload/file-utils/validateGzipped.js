// https://medium.com/the-everyday-developer/detect-file-mime-type-using-magic-numbers-and-javascript-16bc513d4e1e
export default function validateGzipped(file) {
  return new Promise((resolve, reject) => {
    const filereader = new FileReader();

    filereader.onloadend = function (evt) {
      if (evt.target.readyState === FileReader.DONE) {
        const uint = new Uint8Array(evt.target.result);
        const bytes = [];
        uint.forEach((byte) => {
          bytes.push(byte.toString(16));
        });
        const hex = bytes.join('').toUpperCase();
        if (hex !== '1F8B80') {
          reject(new Error(`${file.name} is not in the correct format, reads must be gzipped.`));
        } else {
          resolve();
        }
      }
    };
    const blob = file.slice(0, 4);
    filereader.readAsArrayBuffer(blob);
  });
}
