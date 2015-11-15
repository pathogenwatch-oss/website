import { FETCH_ENTITIES } from '../actions/fetch';

import { systemColumnProps } from '../constants/metadata';

const initialState = [];

function getUserDefinedColumns(assemblies) {
  const ids = Object.keys(assemblies);
  const { userDefined } = assemblies[ids[0]].metadata;

  return userDefined ? Object.keys(userDefined) : [];
}

function buildUserDefinedColumnProps(assemblies) {
  return getUserDefinedColumns(assemblies).map((column) => {
    return {
      label: column.toUpperCase(),
      dataKey: column,
      labelGetter({ metadata }) {
        return metadata.userDefined[column];
      },
    };
  });
}

function mapAssemblyToTableRow(assembly, columns) {
  const { assemblyId } = assembly.metadata;

  return columns.reduce(function (memo, { dataKey, labelGetter }) {
    if (labelGetter) {
      memo[dataKey] = labelGetter(assembly);
    }
    return memo;
  }, { assemblyId });
}

const actions = {
  [FETCH_ENTITIES]: function (state, { ready, result, error }) {
    if (ready && !error) {
      const { assemblies } = result[0];
      const assemblyIds = Object.keys(assemblies);
      const columns =
        systemColumnProps.concat(buildUserDefinedColumnProps(assemblies));

      return {
        columns,
        data: assemblyIds.reduce((data, id) => {
          data.push(mapAssemblyToTableRow(assemblies[id], columns));
          return data;
        }, []),
      };
    }

    return state;
  },
};

export default { actions, initialState };
