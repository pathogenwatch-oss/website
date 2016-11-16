import React from 'react';
import { connect } from 'react-redux';

import { setTable } from '../../actions/table';
import { tableKeys } from '../../constants/table';

const { metadata, resistanceProfile } = tableKeys;

const ContentOptions = ({ displayedTable, dispatch }) => (
  <div
    className="wgsa-table-content-options"
    onClick={event => event.stopPropagation()}
  >
    <button className="wgsa-selectable-column-heading wgsa-selectable-column-heading--active">ANTIBIOTICS</button>
    <button className="wgsa-selectable-column-heading">SNPs</button>
    <button className="wgsa-selectable-column-heading">MOBILE ELEMENTS</button>
  </div>
);

ContentOptions.displayName = 'ContentOptions';

ContentOptions.propTypes = {
  displayedTable: React.PropTypes.string,
  dispatch: React.PropTypes.func,
};

function mapStateToProps({ display }) {
  return {
    displayedTable: display.table,
    // activeContent: getActiveTableContent
  };
}

export default connect(mapStateToProps)(ContentOptions);
