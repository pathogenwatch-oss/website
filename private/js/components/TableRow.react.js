var React = require('react');
var DataUtils = require('../utils/Data');

var cellStyle = {
  whiteSpace: 'nowrap'
};

var TableRow = React.createClass({

  getFormattedResistanceResult: function (resistanceResult) {
    if (resistanceResult === 'RESISTANT') {
      return (<i className="fa fa-square"></i>);
    } else {
      return (<i className="fa fa-square-o"></i>);
    }
  },

  render: function () {
    var isolate = this.props.isolate;
    var rowData = {
      assemblyId: isolate.metadata.fileAssemblyId,
      country: isolate.metadata.geography.location.country,
      source: isolate.metadata.source,
      date: DataUtils.getFormattedDateString(isolate.metadata.date),
      st: isolate.analysis.st
    };
    var resistanceProfile = isolate.analysis.resistanceProfile;
    var dataItemValue;

    var metadataTableCellElements = Object.keys(rowData).map(function (dataItemKey) {
      dataItemValue = rowData[dataItemKey];
      return (<td key={rowData.assemblyId + '_' + dataItemKey} style={cellStyle}>{dataItemValue}</td>);
    });

    var antibioticResistanceTableCellElements = Object.keys(resistanceProfile).map(function (dataItemKey) {
      dataItemValue = resistanceProfile[dataItemKey].resistanceResult;
      return (<td key={rowData.assemblyId + '_' + dataItemKey} className="text-center" style={cellStyle}>{this.getFormattedResistanceResult(dataItemValue)}</td>);
    }.bind(this));

    var tableCellElements = metadataTableCellElements.concat(antibioticResistanceTableCellElements);

    return (
      <tr>
        {tableCellElements}
      </tr>
    );
  }
});

module.exports = TableRow;
