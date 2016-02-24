import UploadActionCreators from '../actions/UploadActionCreators.js';

import UploadStore from '../stores/UploadStore.js';

import Worker from 'worker!./FileWorker';

export const FASTA_FILE_EXTENSIONS = [
  '.fa', '.fas', '.fna', '.ffn', '.faa', '.frn', '.fasta', '.contig',
];

function parseFiles(files, { progress, complete }) {
  const worker = new Worker;
  let currentAssemblies = UploadStore.getAssemblies();

  worker.onmessage = function (event) {
    const { error, assemblies, index } = event.data;

    currentAssemblies = Object.assign(
      {},
      currentAssemblies,
      Object.keys(assemblies).reduce((memo, key) => {
        const newAssembly = assemblies[key];
        const existingAssembly = currentAssemblies[key];

        memo[key] = existingAssembly ?
          Object.assign({}, existingAssembly, newAssembly) :
          newAssembly;

        return memo;
      }, {})
    );

    progress(index / files.length * 100);

    if (index === files.length) {
      UploadActionCreators.addFiles(currentAssemblies);
      setTimeout(complete, 500);
    }
  };

  worker.postMessage({ files });
}

export default {
  parseFiles,
};
