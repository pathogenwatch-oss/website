var React = require('react');

var MetadataTableHeader = React.createClass({

  getTableHeaderCellElement: function (header) {
    var style = {
      borderBottomColor: '#ddd'
    };
    return (<th key={'table-header-cell_' + header} style={style}>{header.replace('__','')}</th>);
  },

  render: function () {
    var headers = this.props.headers;
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
