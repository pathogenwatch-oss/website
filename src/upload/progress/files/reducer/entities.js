import * as actions from '../actions';
import { UPLOAD_ADD_GENOMES } from '../../../actions';

function updateFile(state, { id, filename }, update) {
  if (!(id in state)) return state;
  const files = state[id];
  return {
    ...state,
    [id]: {
      ...files,
      [filename]: {
        ...files[filename],
        ...update,
      },
    },
  };
}

export default function (state = {}, { type, payload }) {
  switch (type) {
    case UPLOAD_ADD_GENOMES.SUCCESS: {
      const nextState = {};
      for (const genome of payload.genomes) {
        const files = {};
        for (const file of genome.files) {
          files[file.name] = {
            error: null,
            handle: file,
            name: file.name,
            progress: 0,
          };
        }
        nextState[genome.id] = files;
      }
      return nextState;
    }

    case 'UPLOAD_READS_PROGRESS':
      return updateFile(state, payload, {
        stage: payload.stage,
        progress: payload.progress,
      });

    case actions.GENOME_UPLOAD_PROGRESS: {
      if (!(payload.id in state)) return state;
      const [ filename ] = Object.keys(state[payload.id]);
      return updateFile(
        state,
        { ...payload, filename },
        {
          progress: payload.progress,
        }
      );
    }

    case actions.UPLOAD_GENOME.FAILURE:
    case actions.PROCESS_GENOME.FAILURE: {
      if (!(payload.id in state)) return state;
      const [ filename ] = Object.keys(state[payload.id]);
      return updateFile(
        state,
        { ...payload, filename },
        {
          error: payload.error,
        }
      );
    }

    default:
      return state;
  }
}
