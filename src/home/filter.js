import createFilter from '../filter';

export const filters = [
  { key: 'species',
    matches(collection, value) {
      return collection.species === value;
    },
  },
];

export const { actions, reducer, selectors } =
  createFilter({
    name: 'home',
    filters,
    getFilterState: ({ home }) => home.filter,
  });
