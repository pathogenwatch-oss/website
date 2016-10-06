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
      const min = new Date(year, parseInt(month || '1', 10) - 1);
      if (date) {
        return date >= min;
      }
      return false;
    },
  },
  { key: 'maxDate',
    matches({ date }, { year, month }) {
      const max = new Date(year, parseInt(month || '1', 10) - 1);
      if (date) {
        return date <= max;
      }
      return false;
    },
  },
];
