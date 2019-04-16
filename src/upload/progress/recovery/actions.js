import { processFiles } from '../files/actions';
import { mapCSVsToGenomes } from '~/upload/utils';
import { getFilenameToGenomeId } from './selectors';

export function recoverUploadSession(files, session) {
  console.log(session);
  return (dispatch, getState) =>
    mapCSVsToGenomes(files)
      .then(uploadedItems => {
        const state = getState();
        const filenameToGenomeId = getFilenameToGenomeId(state);
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
          if (genomeId) {
            item.id = genomeId;
            genomes[genomeId] = item;
          }
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
      })
      .catch(e => {
        dispatch({
          type: 'UPLOAD_ERROR_MESSAGE',
          payload: e.message,
        });
      });
}
