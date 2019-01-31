export const CGPS = {
  COLOURS: {
    GREEN_LIGHT: '#d0e9dc', // 149° 36% 86%
    GREEN_MID: '#87c7a6', // 149° 36% 65%
    GREEN: '#48996F', // 149° 36% 44%
    TURQUOISE: '#3c7383',
    PURPLE_LIGHT: '#a386bd', // 272° 29% 63%
    PURPLE_WARM: '#AC65A6', // 305° 30%, 54%
    PURPLE: '#673c90', // 271° 41% 40%
    GREY: '#e5e5e5',
    GREY_LIGHT: '#efefef',
    GREY_DARK: '#ababab', // 75% of GREY
  },
};

export const ASSEMBLY_FILE_EXTENSIONS = [
  '.fa',
  '.fas',
  '.fna',
  '.ffn',
  '.faa',
  '.frn',
  '.fasta',
  '.genome',
  '.contig',
  '.dna',
];

export const SUPPORTED_FILE_EXTENSIONS = [ '.csv', '.fastq.gz' ].concat(
  ASSEMBLY_FILE_EXTENSIONS
);

export const DEFAULT = {
  SHAPE: 'circle',
  COLOUR: '#555555',
  DANGER_COLOUR: '#d11b1b',
  WARNING_COLOUR: '#d19b1b',
  TREE_TYPE: 'rectangular',
  NODE_SIZE: 10,
  LABEL_SIZE: 10,
  LAYOUT: {
    MINIMUM_CONTAINER_WIDTH: 150,
    MINIMUM_CONTAINER_HEIGHT: 50,
  },
  SELECTED_TREE_NODE_LABEL: 'id',
  MAP: {
    CENTER: {
      LATITUDE: 47.34452036,
      LONGITUDE: 5.85082183,
    },
  },
};

export const statuses = {
  LOADING: 0,
  ERROR: 1,
  SUCCESS: 2,
};
