import React from 'react';
import { connect } from 'react-redux';

import FixedTable from '^/components/FixedTable.react';

const sectionStyle = {
  width: '100%',
  height: '100%',
};

const SouthContent = React.createClass({

  displayName: 'SouthContent',

  propTypes: {
    height: React.PropTypes.number,
    width: React.PropTypes.number,
    data: React.PropTypes.array,
    columns: React.PropTypes.array,
    headerClick: React.PropTypes.func,
    dispatch: React.PropTypes.func,
  },

  render() {
    const {  dispatch, headerClick } = this.props;
    return (
      <section style={sectionStyle}>
        <FixedTable { ...this.props }
          headerClickHandler={(column) => dispatch(headerClick(column))} />
      </section>
    );
  },

});

function mapStateToProps({ display, tables }) {
  return tables[display.table];
}

export default connect(mapStateToProps)(SouthContent);
