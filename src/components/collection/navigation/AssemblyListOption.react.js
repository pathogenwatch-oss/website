var React = require('react');
var css = require('../../../css/UploadReview.css');

var optionsStyle = {
  'backgroundColor': '#fff',
  'lineHeight': '1.5rem',
  'padding': '10px 20px',
  'margin': '0',
  'borderBottom': '1px solid #e0e0e0',
  'width': '100%',
  cursor: 'pointer'
}

var Component = React.createClass({
  propTypes: {
    fileAssemblyId: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <option className='assemblyListOption' style={optionsStyle} value={this.props.fileAssemblyId}>{this.props.fileAssemblyId}</option>
    );
  }
});

module.exports = Component;
