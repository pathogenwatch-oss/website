import { getFilenameToGenomeId } from './selectors';

import { processFiles } from '../files/actions';
import { UPLOAD_ADD_GENOMES } from '../../actions';

import { mapCSVsToGenomes } from '~/upload/file-utils';

export function recoverUploadSession(files, session = []) {
  return (dispatch, getState) => {
    const state = getState();
    const filenameToGenomeId = getFilenameToGenomeId(state);
    const filesToRecover = new Set(Object.keys(filenameToGenomeId));
    const relevantFiles = files.filter((file) => filesToRecover.has(file.name));
    if (relevantFiles.length === 0) {
      dispatch({
        type: 'UPLOAD_ERROR_MESSAGE',
        payload: 'No matching files for this session, please try again.',
      });
      return;
    }
    mapCSVsToGenomes(relevantFiles)
      .then((genomes) => {
        for (const genome of genomes) {
          let genomeId;
          if (genome.files) {
            for (const file of genome.files) {
              filesToRecover.delete(file.name);
              genomeId = genomeId || filenameToGenomeId[file.name];
            }
          }
          if (genomeId) {
            genome.id = genomeId;
            const sessionRecord = session.find((_) => _.genomeId === genomeId);
            if (sessionRecord) {
              genome.recovery = sessionRecord.files;
            }
          }
        }
        if (filesToRecover.size > 0) {
          dispatch({
            type: 'UPLOAD_ERROR_MESSAGE',
            payload: {
              type: 'MISSING_FILES',
              data: Array.from(filesToRecover),
            },
          });
        } else {
          dispatch({
            type: UPLOAD_ADD_GENOMES.SUCCESS,
            payload: {
              genomes,
            },
          });
          dispatch(processFiles());
        }
      })
      .catch((e) => {
        dispatch({
          type: 'UPLOAD_ERROR_MESSAGE',
          payload: e.message,
        });
      });
  };
}
