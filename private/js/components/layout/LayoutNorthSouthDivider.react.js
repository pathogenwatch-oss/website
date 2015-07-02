var React = require('react');
var LayoutUtils = require('../../utils/Layout');
var LayoutDivider = require('./LayoutDivider.react');
var LayoutNavigation = require('../LayoutNavigation.react');

var LayoutNorthSouthDivider = React.createClass({

  propTypes: {
    top: React.PropTypes.number.isRequired,
    showTimeline: React.PropTypes.bool.isRequired,
    onDragEnd: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    this.initialize();
  },

  initialize: function () {
    $('.northSouthDivider').draggable({
      containment: 'body',
      axis: 'y',
      scroll: false,
      cursor: 'ns-resize',
      stop: function (event, ui) {
        var top = ui.offset.top;
        this.props.onDragEnd(top);
      }.bind(this)
    });
  },

  render: function () {

    var style = {
      width: '100%',
      height: '100%'
    };

    return (
      <div style={style}>
        <LayoutDivider
          top={this.props.top}
          direction={'horizontal'}
          isStatic={true} />

        <LayoutDivider
          top={this.props.top}
          direction={'horizontal'}
          className={'northSouthDivider'}>

          <LayoutNavigation
            showTimeline={this.props.showTimeline}
            shortProjectId={this.props.shortProjectId}
            onLayoutNavigationChange={this.props.onLayoutNavigationChange} />

        </LayoutDivider>
      </div>
    );
  }
});

module.exports = LayoutNorthSouthDivider;
