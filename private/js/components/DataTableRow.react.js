var React = require('react');
var DataUtils = require('../utils/Data');

var MetadataTableRow = React.createClass({
  render: function () {
    var isolate = this.props.isolate;
    var isolateId = DataUtils.getDataObject__Id(isolate);
    var columnNames = this.props.columnNames;
    var isolateValue;

    var tableCellElements = columnNames.map(function (columnName) {
      isolateValue = isolate[columnName];

      return (<td key={isolateId + '_' + columnName}>{isolateValue}</td>);
    });

    return (
      <tr>
        {tableCellElements}
      </tr>
    );
  }
});

module.exports = MetadataTableRow;
