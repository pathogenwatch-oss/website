import React from 'react';

import TableStore from '../../../stores/TableStore';
import TableActionCreators from '../../../actions/TableActionCreators';

import ANTIBIOTICS from '../../../../static_data/antibiotics.json';
import { CGPS } from '../../../defaults';

const MetadataTableHeader = React.createClass({

  getTableHeaderCellStyle: function (header) {
    var selectedTableColumnName = TableStore.getColourTableColumnName();
    var selectedTableColumnStyle;

    if (header === selectedTableColumnName) {
      selectedTableColumnStyle = {
        backgroundColor: CGPS.COLOURS.GREEN_LIGHT,
        color: CGPS.COLOURS.PURPLE,
      };
    } else {
      selectedTableColumnStyle = {
        backgroundColor: 'inherit',
      };
    }

    return selectedTableColumnStyle;
  },

  getTableHeaderCellElement: function (header) {
    var style = this.getTableHeaderCellStyle(header);

    return (<th key={'table-header-cell_' + header} style={style} className="mdl-data-table__cell--non-numeric" onClick={this.handleSelectTableColumn.bind(this, header)}>{header}</th>);
  },

  getTableHeaderCellElements: function () {
    return this.getListOfTableHeaderNames().map(this.getTableHeaderCellElement);
  },

  handleSelectTableColumn: function (header) {
    TableActionCreators.setColourTableColumnName(header);
  },

  getListOfAntibioticNames: function () {
    return Object.keys(ANTIBIOTICS);
  },

  getListOfTableHeaderNames: function () {
    var metadataNames = ['Assembly Id'];
    var antibioticNames = this.getListOfAntibioticNames().sort();
    return metadataNames.concat(antibioticNames);
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
