import { getFilenameToGenomeId } from './selectors';
import { getAssemblerUsage } from '~/upload/selectors';

import { processFiles } from '../files/actions';
import { UPLOAD_ADD_GENOMES } from '../../actions';

import { mapCSVsToGenomes } from '~/upload/utils';

export function recoverUploadSession(files, session, uploadedAt) {
  return (dispatch, getState) => {
    const state = getState();
    const usage = getAssemblerUsage(state);
    mapCSVsToGenomes(files, usage)
      .then(genomes => {
        const filenameToGenomeId = getFilenameToGenomeId(state);
        const remaining = new Set(Object.keys(filenameToGenomeId));
        for (const genome of genomes) {
          let genomeId;
          if (genome.files) {
            for (const file of genome.files) {
              remaining.delete(file.name);
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
            type: UPLOAD_ADD_GENOMES.SUCCESS,
            payload: {
              genomes,
              uploadedAt,
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
