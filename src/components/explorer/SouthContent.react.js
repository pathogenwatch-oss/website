import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '^/components/FixedTable.react';

import { activateFilter, resetFilter } from '^/actions/filter';

const sectionStyle = {
  width: '100%',
  height: '100%',
};

function handleRowClick({ assemblyId }, { ids, active }, dispatch) {
  if (active && ids.size === 1 && ids.has(assemblyId)) {
    dispatch(resetFilter());
  } else {
    dispatch(activateFilter(new Set().add(assemblyId)));
  }
}

const SouthContent = React.createClass({

  displayName: 'SouthContent',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    tableProps: React.PropTypes.object,
    data: React.PropTypes.array,
    columns: React.PropTypes.array,
    headerClick: React.PropTypes.func,
    dispatch: React.PropTypes.func,
    display: React.PropTypes.object,
    filter: React.PropTypes.object,
  },

  render() {
    const { dispatch, headerClick, display, filter } = this.props;
    return (
      <section style={sectionStyle} onClick={() => dispatch(resetFilter())}>
        <FixedTable { ...this.props }
          rowClickHandler={({ metadata }) => handleRowClick(metadata, filter, dispatch)}
          headerClickHandler={(column) => dispatch(headerClick(column, display))}
        />
      </section>
    );
  },

});

function getTableData(assemblies, ids, filter) {
  return ids.filter(id => !filter.active || filter.ids.has(id))
            .map(id => assemblies[id]);
}

function mapStateToProps({ entities, display, collection, tables, filter }) {
  const { ...tableProps } = tables[display.table];
  return {
    ...tableProps,
    data: getTableData(entities.assemblies, collection.assemblyIds, filter),
    display,
    filter,
  };
}

export default connect(mapStateToProps)(SouthContent);
