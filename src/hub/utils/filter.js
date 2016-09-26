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
];
