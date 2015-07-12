var React = require('react');
var TableStore = require('../stores/TableStore');
var ANTIBIOTICS = require('../../static_data/antibiotics.json');

var TableActionCreators = require('../actions/TableActionCreators');

var headerStyle = {
  borderBottomColor: '#ddd',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
  cursor: 'pointer'
};

var MetadataTableHeader = React.createClass({

  getTableHeaderCellElement: function (header) {
    return (<th key={'table-header-cell_' + header} style={headerStyle} onClick={this.handleSelectTableColumn.bind(this, header)}>{header}</th>);
  },

  handleSelectTableColumn: function (header) {
    TableActionCreators.setSelectedTableColumn(header);
  },

  getListOfAntibioticNames: function () {
    return Object.keys(ANTIBIOTICS);
  },

  render: function () {
    var metadataNames = ['Assembly Id', 'Country', 'Source', 'Date', 'ST'];
    var antibioticNames = this.getListOfAntibioticNames();
    var headers = metadataNames.concat(antibioticNames);

    var tableHeaderCellElements = headers.map(this.getTableHeaderCellElement);

    return (
      <thead>
        <tr>
          {tableHeaderCellElements}
        </tr>
      </thead>
    );
  }
});

module.exports = MetadataTableHeader;
