var React = require('react');
var LayoutNavigationItem = require('./layout/navigation/Item.react');
var DevelopedAtImperialCollegeLondon = require('./DevelopedAtImperialCollegeLondon.react');
var MenuLabel = require('./MenuLabel.react');

var Navigation = React.createClass({

  propTypes: {
    showTimeline: React.PropTypes.bool.isRequired,
    shortProjectId: React.PropTypes.string.isRequired
  },

  getInitialState: function () {
    return {
      active: 'table'
    };
  },

  handleClick: function (itemName) {
    this.props.onLayoutNavigationChange(itemName);
    this.setState({
      active: itemName
    });
  },

  render: function () {
    var navigationContainerStyle = {};

    return (
      <div style={navigationContainerStyle} data-layout="navigation">

        <MenuLabel />

        <LayoutNavigationItem name="table" isActive={this.state.active === 'table'} onClick={this.handleClick} />
        { this.props.showTimeline ? <LayoutNavigationItem name="timeline" isActive={this.state.active === 'timeline'} onClick={this.handleClick} /> : null }
        <LayoutNavigationItem name="display" isActive={this.state.active === 'display'} onClick={this.handleClick} />
        <LayoutNavigationItem name="download" isActive={this.state.active === 'download'} onClick={this.handleClick} />
        <LayoutNavigationItem name="about" isActive={this.state.active === 'about'} onClick={this.handleClick} />
        <LayoutNavigationItem name="twitter" shortProjectId={this.props.shortProjectId} />

        <DevelopedAtImperialCollegeLondon />

      </div>
    );
  }
});

module.exports = Navigation;
