import React from 'react';

import DownloadButton from '../../DownloadButton.react.js';

import DataUtils from '../../../utils/Data';
import MetadataUtils from '../../../utils/Metadata';

const downloadButtonProps = {
  format: 'fasta',
  description: 'Assembly Fasta',
};

const resistantStyle = {
  color: '#ff0000',
};

const buttonCellStyle = {
  paddingTop: 0,
  verticalAlign: 'middle',
};

const TableRow = React.createClass({

  rowData: null,

  getInitialState() {
    return {
      loading: false,
      link: null,
    };
  },

  componentWillMount() {
    const isolate = this.props.isolate;

    this.rowData = {
      assemblyId: {
        name: 'Assembly',
        value: isolate.metadata.assemblyName,
      },
      country: {
        name: 'Country',
        value: MetadataUtils.getCountry(isolate),
      },
      date: {
        name: 'Date',
        value: DataUtils.getFormattedDateString(isolate.metadata.date),
      },
      st: {
        name: 'ST',
        value: isolate.analysis.st,
        numeric: true,
      },
    };
  },

  getFormattedResistanceResult(resistanceResult) {
    if (resistanceResult === 'RESISTANT') {
      return (<i className="fa fa-square" style={resistantStyle}></i>);
    }

    return (<i className="fa fa-square-o"></i>);
  },

  getIsolateMetadataTableCellElements() {
    const metadataTableCellElements = Object.keys(this.rowData).map((dataItemKey) => {
      const dataItem = this.rowData[dataItemKey];

      const cellStyle = {
        whiteSpace: 'nowrap',
      };

      return (<td key={this.rowData.assemblyId.value + '_' + dataItemKey} style={cellStyle} className={dataItem.numeric ? '' : 'mdl-data-table__cell--non-numeric'}>{dataItem.value}</td>);
    });

    return metadataTableCellElements;
  },

  getTableRowElements() {
    return this.getIsolateMetadataTableCellElements();
  },

  render() {
    return (
      <tr>
        {this.getTableRowElements()}
        <td style={buttonCellStyle}>
          <DownloadButton
            id={this.props.isolate.metadata.assemblyId} {...downloadButtonProps} />
        </td>
      </tr>
    );
  },

});

module.exports = TableRow;
