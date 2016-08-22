export const UPLOAD_FASTA = 'UPLOAD_FASTA';

export function uploadFasta(name, uploadPromise) {
  return {
    type: UPLOAD_FASTA,
    name,
    promise: uploadPromise,
  };
}

export const UPDATE_FASTA_PROGRESS = 'UPDATE_FASTA_PROGRESS';

export function updateFastaProgress(name, progress) {
  console.log(name, progress);
  return {
    type: UPDATE_FASTA_PROGRESS,
    name,
    progress,
  };
}
