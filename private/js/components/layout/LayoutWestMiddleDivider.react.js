var React = require('react');
var LayoutUtils = require('../../utils/Layout');
var LayoutDivider = require('./LayoutDivider.react');

var LayoutWestMiddleDivider = React.createClass({

  propTypes: {
    left: React.PropTypes.number.isRequired,
    onDragEnd: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    this.initialize();
  },

  initialize: function () {

    var middleWestDividerLeft = this.props.left;
    var containmentRight = this.props.containmentRight - LayoutUtils.getDividerSize();

    var containment = [
      // x1
      0,
      // y1
      0,
      // x2
      containmentRight,
      // y2
      0
    ];

    $('.westMiddleDivider').draggable({
      containment: containment,
      axis: 'x',
      scroll: false,
      cursor: 'ew-resize',
      stop: function (event, ui) {
        var left = ui.offset.left;
        this.props.onDragEnd(left);
      }.bind(this)
    });
  },

  componentDidUpdate: function () {

    var layoutMiddleEastDividerLeft = this.props.layoutMiddleEastDividerLeft - LayoutUtils.getDividerSize();

    var containment = [
      // x1
      0,
      // y1
      0,
      // x2
      layoutMiddleEastDividerLeft,
      // y2
      0
    ];

    $('.westMiddleDivider').draggable( 'option', 'containment', containment );
  },

  render: function () {

    var style = {
      width: '100%',
      height: '100%'
    };

    return (
      <div style={style}>
        <LayoutDivider
          left={this.props.left}
          direction={'vertical'}
          isStatic={true} />

        <LayoutDivider
          left={this.props.left}
          direction={'vertical'}
          className={'westMiddleDivider'} />
      </div>
    );
  }
});

module.exports = LayoutWestMiddleDivider;
