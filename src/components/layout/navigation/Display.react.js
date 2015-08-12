var React = require('react');

var LayoutNavigationDisplay = React.createClass({

  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  handleClick: function () {
    this.props.onClick('display');
  },

  render: function () {
    return (
      <i className="fa fa-eye" onClick={this.handleClick} title={'Display'}></i>
    );
  }
});

module.exports = LayoutNavigationDisplay;
