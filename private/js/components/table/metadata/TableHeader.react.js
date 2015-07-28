var React = require('react');
var assign = require('object-assign');
var ANTIBIOTICS = require('../../../../static_data/antibiotics.json');

var TableStore = require('../../../stores/TableStore');
var TableStore = require('../../../stores/TableStore');
var TableActionCreators = require('../../../actions/TableActionCreators');

var headerStyle = {
  borderBottomColor: '#ddd',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
  cursor: 'pointer'
};

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

    return assign({}, headerStyle, selectedTableColumnStyle);
  },

  getTableHeaderCellElement: function (header) {
    var style = this.getTableHeaderCellStyle(header);

    return (<th key={'table-header-cell_' + header} style={style} onClick={this.handleSelectTableColumn.bind(this, header)}>{header}</th>);
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
