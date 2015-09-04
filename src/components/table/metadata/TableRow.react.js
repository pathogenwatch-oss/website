import '../../../css/spinner.css';

import React from 'react';

import DownloadStore from '../../../stores/DownloadStore';
import DownloadActionCreators from '../../../actions/DownloadActionCreators';

import DataUtils from '../../../utils/Data';
import MetadataUtils from '../../../utils/Metadata';

import { CGPS } from '../../../defaults';

const resistantStyle = {
  color: '#ff0000',
};

const iconStyle = {
  color: CGPS.COLOURS.PURPLE,
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
        value: isolate.metadata.assemblyFilename,
      },
      country: {
        name: 'Country',
        value: MetadataUtils.getCountry(isolate),
      },
      source: {
        name: 'Source',
        value: isolate.metadata.source,
        numeric: true,
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

  componentDidMount() {
    DownloadStore.addChangeListener(this.handleDownloadStoreChange);
  },

  componentWillUnmount() {
    DownloadStore.removeChangeListener(this.handleDownloadStoreChange);
  },

  componentDidUpdate() {
    if (this.state.loading) {
      componentHandler.upgradeElement(React.findDOMNode(this.refs.spinner));
    }
  },

  handleDownloadStoreChange() {
    const link = DownloadStore.getLink(this.props.isolate.metadata.assemblyId);
    if (link) {
      this.setState({
        loading: false,
        link,
      });
    }
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
          <DownloadButton />
        </td>
      </tr>
    );
  },

});

module.exports = TableRow;
