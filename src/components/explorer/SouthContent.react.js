import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '^/components/FixedTable.react';

import { activateFilter, resetFilter } from '^/actions/filter';

const sectionStyle = {
  width: '100%',
  height: '100%',
};

function handleRowClick(assemblyId, { ids, active }, dispatch) {
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
    filter: React.PropTypes.object,
  },

  render() {
    const { dispatch, headerClick, filter } = this.props;
    return (
      <section style={sectionStyle}>
        <FixedTable { ...this.props }
          rowClickHandler={({ assemblyId }) => handleRowClick(assemblyId, filter, dispatch)}
          headerClickHandler={(column) => dispatch(headerClick(column))}
        />
      </section>
    );
  },

});

function mapStateToProps({ display, tables, filter }) {
  const { data, ...tableProps } = tables[display.table];
  return {
    ...tableProps,
    data: data.filter(({ assemblyId }) => !filter.active || filter.ids.has(assemblyId)),
    filter,
  };
}

export default connect(mapStateToProps)(SouthContent);
