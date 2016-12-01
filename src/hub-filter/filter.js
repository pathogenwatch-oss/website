import { contains } from 'leaflet-lassoselect/utils';

export { UPLOAD as stateKey } from '../app/stateKeys/filter';

export const filters = [
  { key: 'searchRegExp',
    matches(fasta, regexp) {
      return regexp ? regexp.test(fasta.name) : true;
    },
  },
  { key: 'speciesKey',
    queryKey: 'species',
    matches(fasta, value) {
      return fasta.speciesKey === value;
    },
  },
  { key: 'country',
    queryKey: 'country',
    matches(fasta, value) {
      return fasta.country && fasta.country === value;
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
    matches({ metadata: { latitude, longitude } = {} }, path) {
      if (latitude && longitude) {
        return contains(path, { lat: latitude, lng: longitude });
      }
      return false;
    },
  },
];
