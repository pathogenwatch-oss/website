import { createSelector } from 'reselect';

import { taxIdMap } from '../species';

export const getWgsaSpecies = () => [
  {
    speciesId: '1280',
    deployed: true,
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
  {
    speciesId: '90370',
    deployed: true,
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
  {
    speciesId: '485',
    deployed: true,
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
  {
    speciesId: '64320',
    deployed: false,
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
];

export const getOtherSpecies = () => [
  {
    speciesId: '1280',
    speciesName: 'Species A',
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
  {
    speciesId: '90370',
    speciesName: 'Species B',
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
  {
    speciesId: '485',
    speciesName: 'Species C',
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
  {
    speciesId: '64320',
    speciesName: 'Species D',
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
  {
    speciesId: '1280',
    speciesName: 'Species A',
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
  {
    speciesId: '90370',
    speciesName: 'Species B',
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
  {
    speciesId: '485',
    speciesName: 'Species C',
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
  {
    speciesId: '64320',
    speciesName: 'Species D',
    collections: Math.ceil(Math.random() * 100),
    genomes: Math.ceil(Math.random() * 1000),
  },
];
