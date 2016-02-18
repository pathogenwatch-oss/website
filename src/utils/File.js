import MetadataUtils from './Metadata';
import AnalysisUtils from './Analysis';

import UploadStore from '../stores/UploadStore';
import Worker from 'worker!./FileWorker';

export const FASTA_FILE_EXTENSIONS = [
  '.fa', '.fas', '.fna', '.ffn', '.faa', '.frn', '.fasta', '.contig',
];

function parseFiles(files, callback) {
  const allAssemblies = UploadStore.getAssemblies();
  const allRawFiles = {};
  const worker = new Worker;
  let i = 0;
  worker.onmessage = function(event) {
    const { error, rawFiles, assemblies } = event.data;
    for (const key in rawFiles) {
      allRawFiles[key] = rawFiles[key];
    }
    for (const key in assemblies) {
      allAssemblies[key] = assemblies[key];
    }
    i++;
    if (true || i < 10 || i % 10 === 0 || i === files.length) {
      callback(error, allRawFiles, allAssemblies);
    }
  }
  worker.postMessage({ files });
}

export default {
  parseFiles,
};
