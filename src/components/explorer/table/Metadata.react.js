import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '^/components/FixedTable.react';

import FilteredDataActionCreators from '^/actions/FilteredDataActionCreators';


function setLabelGetter(columnDef) {
  FilteredDataActionCreators.setActiveColumn(columnDef);
}

const Metadata = React.createClass({

  displayName: 'Metadata',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    data: React.PropTypes.array,
    columns: React.PropTypes.array,
  },

  render() {
    return (
      <FixedTable
        { ...this.props }
        headerClickHandler={setLabelGetter}
      />
    );
  },

});

export default connect(({ tables }) => tables.metadata)(Metadata);
