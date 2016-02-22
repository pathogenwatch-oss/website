import MetadataUtils from './Metadata';
import AnalysisUtils from './Analysis';

import UploadActionCreators from '../actions/UploadActionCreators.js';
import UploadStore from '../stores/UploadStore';
import Worker from 'worker!./FileWorker';

export const FASTA_FILE_EXTENSIONS = [
  '.fa', '.fas', '.fna', '.ffn', '.faa', '.frn', '.fasta', '.contig',
];

function parseFiles(files, callback) {
  UploadActionCreators.startProcessingFiles();

  const allAssemblies = {};
  const worker = new Worker;
  let i = 0;
  worker.onmessage = function(event) {
    const { error, assemblies } = event.data;
    console.log(typeof assemblies);
    for (const key in assemblies) {
      allAssemblies[key] = assemblies[key];
    }
    i++;
    if (true || i % 8 === 0 || i === files.length) {
      UploadActionCreators.addFiles(allAssemblies);
    }
    if (i === files.length) {
      UploadActionCreators.finishProcessingFiles();
    }
  }
  worker.postMessage({ files });
}

export default {
  parseFiles,
};
