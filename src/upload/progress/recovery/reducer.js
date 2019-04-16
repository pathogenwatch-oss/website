import * as actions from '../actions';
import { ADD_GENOMES } from '../../actions';

const initialState = {
  filenameToGenomeId: {},
  pendingFiles: [],
  fileIds: {},
};

export default function (state = initialState, { type, payload }) {
  switch (type) {
    case actions.UPLOAD_FETCH_GENOMES.ATTEMPT:
      return initialState;

    case actions.UPLOAD_FETCH_GENOMES.SUCCESS: {
      const filenameToGenomeId = {};
      const pendingFiles = [];
      const { genomes } = payload.result;
      for (const genome of genomes) {
        if (genome.files) {
          pendingFiles.push(genome.files.sort());
          for (const filename of genome.files) {
            filenameToGenomeId[filename] = genome.id;
          }
        }
      }
      return {
        ...state,
        pendingFiles,
        filenameToGenomeId,
      };
    }

    case ADD_GENOMES.SUCCESS: {
      const fileIds = {};
      for (const genome of payload.genomes) {
        if (genome.recovery) {
          fileIds[genome.id] = genome.recovery;
        }
      }

      return {
        ...state,
        fileIds,
      };
    }

    default:
      return state;
  }
}
