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
];
