import { contains } from 'leaflet-lassoselect/utils';

export const metadataFilters = [
  { key: 'speciesKey',
    matches(fasta, value) {
      return fasta.speciesKey === value;
    },
  },
  { key: 'country',
    matches(fasta, value) {
      return fasta.country && fasta.country.name === value;
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
];
