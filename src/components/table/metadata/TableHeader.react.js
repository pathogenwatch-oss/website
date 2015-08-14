import React from 'react';

import TableStore from '../../../stores/TableStore';
import TableActionCreators from '../../../actions/TableActionCreators';

import ANTIBIOTICS from '../../../../static_data/antibiotics.json';

var MetadataTableHeader = React.createClass({

  getTableHeaderCellStyle: function (header) {
    var selectedTableColumnName = TableStore.getLabelTableColumnName();
    var selectedTableColumnStyle;

    if (header === selectedTableColumnName) {
      selectedTableColumnStyle = {
        backgroundColor: '#e0efff'
      };
    } else {
      selectedTableColumnStyle = {
        backgroundColor: 'inherit'
      };
    }

    return selectedTableColumnStyle;
  },

  getTableHeaderCellElement: function (header) {
    var style = this.getTableHeaderCellStyle(header);

    return (<th key={'table-header-cell_' + header} className="mdl-data-table__cell--non-numeric" style={style} onClick={this.handleSelectTableColumn.bind(this, header)}>{header}</th>);
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
    var metadataNames = ['Assembly Id', 'Country', 'Source', 'Date', 'ST'];
    return metadataNames;
  },

  render: function () {
    return (
      <thead>
        <tr>
          {this.getTableHeaderCellElements()}
        </tr>
      </thead>
    );
  }
});

module.exports = MetadataTableHeader;
