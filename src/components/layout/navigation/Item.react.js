var React = require('react');

var LayoutNavigationTable = require('./Table.react');
var LayoutNavigationTimeline = require('./Timeline.react');
var LayoutNavigationDisplay = require('./Display.react');
var LayoutNavigationDownload = require('./Download.react');
var LayoutNavigationAbout = require('./About.react');
var LayoutNavigationTwitter = require('./Twitter.react');

var LayoutNavigationItem = React.createClass({

  COLORS: {
    HOVER: '#e74c3c',
    ACTIVE: '#000000',
    DEFAULT: 'inherit'
  },

  propTypes: {
    name: React.PropTypes.string.isRequired,
    isActive: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    shortProjectId: React.PropTypes.string
  },

  getInitialState: function () {
    return ({
      hover: null,
      active: this.props.active
    });
  },

  handleMouseEnter: function (itemName) {
    this.setState({
      hover: itemName
    });
  },

  handleMouseLeave: function () {
    this.setState({
      hover: null
    });
  },

  getNavigationItemColor: function (itemName) {
    if (this.state.hover === itemName) {
      return this.COLORS.HOVER;
    } else if (this.props.isActive) {
      return this.COLORS.ACTIVE;
    }

    return this.COLORS.DEFAULT;
  },

  getNavigationItem: function (itemName) {

    var onClick = this.props.onClick || null;
    var shortProjectId = this.props.shortProjectId || null;

    var tableElement = <LayoutNavigationTable onClick={onClick} />;
    var timelineElement = <LayoutNavigationTimeline onClick={onClick} />;
    var displayElement = <LayoutNavigationDisplay onClick={onClick} />;
    var downloadElement = <LayoutNavigationDownload onClick={onClick} />;
    var aboutElement = <LayoutNavigationAbout onClick={onClick} />;
    var twitterElement = <LayoutNavigationTwitter shortProjectId={shortProjectId} />;

    var items = {
      'table': tableElement,
      'timeline': timelineElement,
      'display': displayElement,
      'download': downloadElement,
      'about': aboutElement,
      'twitter': twitterElement
    };

    var navigationElement = items[itemName];
    var color = this.getNavigationItemColor(itemName);

    var style = {
      display: 'inline-block',
      margin: '0 5px',
      lineHeight: '24px',
      cursor: 'pointer',
      color: color
    };

    return <div style={style} onMouseEnter={this.handleMouseEnter.bind(this, itemName)} onMouseLeave={this.handleMouseLeave}>{navigationElement}</div> || null;
  },

  render: function () {
    var itemName = this.props.name;
    return this.getNavigationItem(itemName);
  }
});

module.exports = LayoutNavigationItem;
