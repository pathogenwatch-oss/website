import React from 'react';

import TableStore from '../../../stores/TableStore';
import TableActionCreators from '../../../actions/TableActionCreators';

import ANTIBIOTICS from '../../../../static_data/antibiotics.json';
import { CGPS } from '../../../defaults';

const MetadataTableHeader = React.createClass({

  getTableHeaderCellStyle: function (header) {
    const selectedTableColumnName = TableStore.getLabelTableColumnName();
    const style = {
      cursor: 'pointer',
    };

    if (header === selectedTableColumnName) {
      style.color = CGPS.COLOURS.PURPLE;
    }

    return style;
  },

  getTableHeaderCellElement: function (header) {
    const style = this.getTableHeaderCellStyle(header);

    return (
      <th key={'table-header-cell_' + header} className="mdl-data-table__cell--non-numeric" style={style} onClick={this.handleSelectTableColumn.bind(this, header)}>{header}</th>
    );
  },

  getTableHeaderCellElements: function () {
    return this.getListOfTableHeaderNames().map(this.getTableHeaderCellElement);
  },

  handleSelectTableColumn: function (header) {
    TableActionCreators.setLabelTableColumnName(header);
  },

  getListOfAntibioticNames: function () {
    return Object.keys(ANTIBIOTICS);
  },

  getListOfTableHeaderNames: function () {
    return [ 'Assembly', 'Location', 'Date', 'ST', 'MLST', 'Total Complete Matches', '' ];
  },

  render: function () {
    return (
      <thead>
        <tr>
          {this.getTableHeaderCellElements()}
        </tr>
      </thead>
    );
  },

});

module.exports = MetadataTableHeader;
