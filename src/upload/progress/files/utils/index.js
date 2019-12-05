import { readAsText } from 'promise-file-reader';

import { validateGenomeContent } from './validation';

import getCompressWorker from 'workerize-loader?name=compress.[hash]!./compressWorker';

import config from '~/app/config';

export function isReadsEligible() {
  return 'assemblerAddress' in config;
}

export function compress(text) {
  const worker = getCompressWorker();
  return worker.compress(text);
}

export function validateAssembly(genome) {
  return Promise.resolve(genome.files[0].handle)
    .then(readAsText)
    .then(validateGenomeContent);
}
