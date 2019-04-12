import { processFiles } from '../files/actions';
import { mapCSVsToGenomes } from '~/upload/utils';

export function recoverUploadSession(files, session) {
  return (dispatch, getState) =>
    mapCSVsToGenomes(files).then(uploadedItems => {
      const state = getState();
      const { filenameToGenomeId } = state.upload.progress.recovery;
      const remaining = new Set(Object.keys(filenameToGenomeId));
      const genomes = {};
      for (const item of uploadedItems) {
        let genomeId;
        if (item.files) {
          for (const file of item.files) {
            remaining.delete(file.name);
            genomeId = genomeId || filenameToGenomeId[file.name];
          }
        }
        item.id = genomeId;
        genomes[genomeId] = item;
      }
      if (remaining.size > 0) {
        dispatch({
          type: 'UPLOAD_ERROR_MESSAGE',
          payload: {
            type: 'MISSING_FILES',
            data: Array.from(remaining),
          },
        });
      } else {
        dispatch({
          type: 'UPLOAD_RECOVER_SESSION',
          payload: {
            genomes,
            session,
          },
        });
        dispatch(processFiles());
      }
    });
}
