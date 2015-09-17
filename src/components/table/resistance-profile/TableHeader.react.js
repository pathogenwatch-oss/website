import React from 'react';

import AntibioticsStore from '../../../stores/AntibioticsStore';
import FilteredDataStore from '../../../stores/FilteredDataStore';

import FilteredDataActionCreators from '../../../actions/FilteredDataActionCreators';

import { CGPS } from '../../../defaults';

const MetadataTableHeader = React.createClass({

  getTableHeaderCellStyle: function (header) {
    const selectedTableColumnName = FilteredDataStore.getColourTableColumnName();
    const style = {
      cursor: 'pointer',
    };

    if (header === selectedTableColumnName) {
      style.color = CGPS.COLOURS.PURPLE;
    }

    return style;
  },

  getTableHeaderCellElement: function (header) {
    var style = this.getTableHeaderCellStyle(header);

    return (<th key={'table-header-cell_' + header} style={style} className="mdl-data-table__cell--non-numeric" onClick={this.handleSelectTableColumn.bind(this, header)}>{header}</th>);
  },

  getTableHeaderCellElements: function () {
    return this.getListOfTableHeaderNames().map(this.getTableHeaderCellElement);
  },

  handleSelectTableColumn: function (header) {
    FilteredDataActionCreators.setColourTableColumnName(header);
  },

  getListOfAntibioticNames: function () {
    return Object.keys(AntibioticsStore.get());
  },

  getListOfTableHeaderNames: function () {
    var metadataNames = ['Assembly'];
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
