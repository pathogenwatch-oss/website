var React = require('react');

var LayoutNavigationTable = React.createClass({

  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  handleClick: function () {
    this.props.onClick('table');
  },

  render: function () {
    return (
      <i className="fa fa-table" onClick={this.handleClick} title={'Table'}></i>
    );
  }
});

module.exports = LayoutNavigationTable;
