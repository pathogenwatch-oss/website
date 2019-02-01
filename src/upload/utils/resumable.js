import Resumable from 'resumablejs';

import hashWorker from 'workerize-loader!./hashWorker';

import config from '../../app/config';

function hashFile(file) {
  const worker = hashWorker();
  return worker.hash(file);
}

export function processReads(genome, token, dispatch) {
  const r = new Resumable({
    target: `${config.assemblerAddress}/upload`,
    simultaneousUploads: 5,
    generateUniqueIdentifier: hashFile,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  r.on('fileProgress', console.log);
  return new Promise((resolve, reject) => {
    r.on('error', (message, file) => {
      console.error(message, file);
      reject({ message, file });
    });
    r.on('progress', console.log);
    r.on('catchAll', console.log);
    const files = Object.values(genome.files);
    r.on('filesAdded', () => r.upload());
    r.addFiles(files);
  });
}
