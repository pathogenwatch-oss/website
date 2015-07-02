var React = require('react');

var LayoutNavigationAbout = React.createClass({

  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  handleClick: function () {
    this.props.onClick('about');
  },

  render: function () {
    return (
      <i className="fa fa-info-circle" onClick={this.handleClick} title={'About'}></i>
    );
  }
});

module.exports = LayoutNavigationAbout;
