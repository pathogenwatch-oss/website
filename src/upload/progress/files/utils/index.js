import { readAsText } from 'promise-file-reader';

import { validateGenomeSize, validateGenomeContent } from './validation';

import getCompressWorker from 'worker-loader?name=compress.[hash].worker.js!./compressWorker';

import config from '~/app/config';

export function isReadsEligible() {
  return 'assemblerAddress' in config;
}

export function compress(text) {
  return new Promise((resolve, reject) => {
    const worker = getCompressWorker();
    worker.onmessage = function (event) {
      resolve(event.data);
    };
    worker.onerror = reject;
    worker.postMessage(text);
  });
}

export function validate(genome) {
  return validateGenomeSize(genome.file)
    .then(readAsText)
    .then(validateGenomeContent);
}
