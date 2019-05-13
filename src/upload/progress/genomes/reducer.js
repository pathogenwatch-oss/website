import { UPLOAD_FETCH_GENOMES } from '../actions';
import { UPLOAD_ADD_GENOMES } from '../../actions';

export default function (state = {}, { type, payload }) {
  switch (type) {
    case UPLOAD_ADD_GENOMES.SUCCESS: {
      const nextState = { ...state };
      for (const genome of payload.genomes) {
        nextState[genome.id] = {
          id: genome.id,
          name: genome.name,
          type: genome.type,
        };
      }
      return nextState;
    }

    case UPLOAD_FETCH_GENOMES.SUCCESS: {
      const nextState = {};
      for (const genome of payload.result.genomes) {
        nextState[genome.id] = {
          id: genome.id,
          name: genome.name,
          type: genome.type,
          ...state[genome.id], // retains existing state during an upload
        };
      }
      return nextState;
    }

    default:
      return state;
  }
}
