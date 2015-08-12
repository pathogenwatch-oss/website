var React = require('react');

var LayoutNavigationTimeline = React.createClass({

  propTypes: {
    onClick: React.PropTypes.func.isRequired
  },

  handleClick: function () {
    this.props.onClick('timeline');
  },

  render: function () {
    return (
      <i className="fa fa-clock-o" onClick={this.handleClick} title={'Timeline'}></i>
    );
  }
});

module.exports = LayoutNavigationTimeline;
