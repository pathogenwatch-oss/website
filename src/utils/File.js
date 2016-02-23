import UploadActionCreators from '../actions/UploadActionCreators.js';
import Worker from 'worker!./FileWorker';

export const FASTA_FILE_EXTENSIONS = [
  '.fa', '.fas', '.fna', '.ffn', '.faa', '.frn', '.fasta', '.contig',
];

function parseFiles(files, callback) {
  const worker = new Worker;
  worker.onmessage = function (event) {
    const { error, key, assembly, index } = event.data;

    UploadActionCreators.addFiles({ [key]: assembly });

    if (index === files.length) {
      callback();
    }
  };
  worker.postMessage({ files });
}

export default {
  parseFiles,
};
