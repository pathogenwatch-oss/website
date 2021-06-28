import { readAsText } from 'promise-file-reader';

import getCompressWorker from 'workerize-loader?name=compress.[hash]!./compressWorker';
import { validateGenomeContent } from './validation';

export function compress(text) {
  const worker = getCompressWorker();
  return worker.compress(text);
}

export function validateAssembly(genome) {
  return Promise.resolve(genome.files[0].handle)
    .then(readAsText)
    .then(validateGenomeContent);
}
