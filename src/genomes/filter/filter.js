import { contains } from 'leaflet-lassoselect/utils';

export { GENOME as stateKey } from '../../app/stateKeys/filter';

export const filters = [
  { key: 'searchRegExp',
    matches(genome, regexp) {
      return regexp ? regexp.test(genome.name) : true;
    },
  },
  { key: 'speciesKey',
    queryKey: 'species',
    matches(genome, value) {
      return genome.speciesId === value;
    },
  },
  { key: 'reference',
    queryKey: 'reference',
    matches(genome, value) {
      return value === 'true' ? genome.reference : !genome.reference;
    },
  },
  { key: 'owner',
    queryKey: 'owner',
    matches(genome, value) {
      return genome.owner === value;
    },
  },
  { key: 'country',
    queryKey: 'country',
    matches(genome, value) {
      return genome.country && genome.country === value;
    },
  },
  { key: 'minDate',
    matches({ date }, { year, month } = {}) {
      if (!year) return true;
      const min = new Date(year, month || 0);
      if (date) {
        return date >= min;
      }
      return false;
    },
  },
  { key: 'maxDate',
    matches({ date }, { year, month }) {
      if (!year) return true;
      const max = new Date(year, month || 11);
      if (date) {
        return date <= max;
      }
      return false;
    },
  },
  { key: 'area',
    matches({ latitude, longitude }, path) {
      if (latitude && longitude) {
        return contains(path, { lat: latitude, lng: longitude });
      }
      return false;
    },
  },
];
