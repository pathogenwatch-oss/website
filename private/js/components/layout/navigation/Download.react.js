var React = require('react');

var LayoutNavigationDownload = React.createClass({

  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  handleClick: function () {
    this.props.onClick('download');
  },

  render: function () {
    return (
      <i className="fa fa-download" onClick={this.handleClick} title={'Download'}></i>
    );
  }
});

module.exports = LayoutNavigationDownload;
