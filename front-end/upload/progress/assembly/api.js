import { fetchRaw, fetchJson } from '~/utils/Api';
import { uploadComplete } from '../files/api';
import config from '~/app/config';

const { clientId } = config;

function uploadReadsProgress(stage, id, filename, progress) {
  return {
    type: 'UPLOAD_READS_PROGRESS',
    payload: {
      stage,
      id,
      filename,
      progress,
    },
  };
}

async function uploadReads(genome, progressFn) {
  // FIXME do some retries
  const { id, files = [] } = genome;

  for (const file of files) {
    const { name: fileName, handle } = file;
    const fileProgress = (p) => { progressFn(fileName, p); };

    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('content', handle);

    await fetchRaw({
      method: 'PUT',
      path: `/api/genome/${id}/reads?${$.param({ clientId })}`,
      contentType: false,
      data: formData,
      processData: false,
      progressFn: fileProgress,
    });
  }
}

export async function upload(genome, { uploadedAt }, dispatch) {
  const progressFn = (fileName, progress) => {
    dispatch(
      uploadReadsProgress(
        'UPLOAD',
        genome.id,
        fileName,
        progress
      )
    );
  };

  await uploadReads(genome, progressFn);
  await uploadComplete(genome.id);
}

export function fetchSession(uploadedAt) {
  return new Promise((resolve, reject) =>
    fetchJson('GET', `/upload/${uploadedAt}`).then((response) => {
      if (response.status === 200) {
        const { progress } = response.json();
        resolve({ progress });
      } else if (response.status === 404) {
        reject({ type: 'NOT_FOUND' });
      } else {
        reject({ message: response.statusText });
      }
    })
  );
}
