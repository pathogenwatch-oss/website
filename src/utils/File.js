import MetadataUtils from './Metadata';
import AnalysisUtils from './Analysis';

import UploadStore from '../stores/UploadStore';
import Worker from 'worker!./FileWorker';

export const FASTA_FILE_EXTENSIONS = [
  '.fa', '.fas', '.fna', '.ffn', '.faa', '.frn', '.fasta', '.contig',
];

function parseFiles(files, callback) {
  const worker = new Worker;
  worker.onmessage = function(event) {
    const { error, rawFiles, assemblies } = event.data;
    callback(error, rawFiles, assemblies);
  }
  worker.postMessage(files);
}

export default {
  parseFiles,
};
