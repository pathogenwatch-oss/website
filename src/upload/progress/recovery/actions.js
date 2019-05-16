import { getFilenameToGenomeId } from './selectors';
import { getAssemblerUsage } from '~/upload/selectors';

import { processFiles } from '../files/actions';
import { UPLOAD_ADD_GENOMES } from '../../actions';

import { mapCSVsToGenomes } from '~/upload/utils';

export function recoverUploadSession(files, session = []) {
  return (dispatch, getState) => {
    const state = getState();
    const usage = getAssemblerUsage(state);
    const filenameToGenomeId = getFilenameToGenomeId(state);
    const filesToRecover = new Set(Object.keys(filenameToGenomeId));
    mapCSVsToGenomes(files.filter(file => filesToRecover.has(file.name)), usage)
      .then(genomes => {
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
            const sessionRecord = session.find(_ => _.genomeId === genomeId);
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
      .catch(e => {
        dispatch({
          type: 'UPLOAD_ERROR_MESSAGE',
          payload: e.message,
        });
      });
  };
}
