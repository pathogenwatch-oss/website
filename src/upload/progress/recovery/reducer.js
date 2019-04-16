import * as actions from '../actions';

const initialState = {
  filenameToGenomeId: {},
  pendingFiles: [],
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

    default:
      return state;
  }
}
