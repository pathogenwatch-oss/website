var React = require('react');
var LayoutUtils = require('../../utils/Layout');
var LayoutDivider = require('./LayoutDivider.react');

var LayoutMiddleEastDivider = React.createClass({

  propTypes: {
    left: React.PropTypes.number.isRequired,
    onDragEnd: React.PropTypes.func.isRequired
  },

  componentDidMount: function () {
    this.initialize();
  },

  initialize: function () {

    var containment = [
      // x1
      LayoutUtils.getEastLeft(),
      // y1
      LayoutUtils.getNorthHeight(),
      // x2
      LayoutUtils.getViewportWidth() - LayoutUtils.getDividerSize(),
      // y2
      0
    ];

    $('.westEastDivider').draggable({
      containment: containment,
      axis: 'x',
      scroll: false,
      cursor: 'grabbing',
      stop: (event, ui) => {
        this.props.onDragEnd(ui.offset.left);
      },
    });
  },

  componentDidUpdate: function () {

    var layoutWestMiddleDividerLeft = this.props.layoutWestMiddleDividerLeft;

    var containment = [
      // x1
      layoutWestMiddleDividerLeft + LayoutUtils.getDividerSize(),
      // y1
      LayoutUtils.getNorthHeight(),
      // x2
      LayoutUtils.getViewportWidth() - LayoutUtils.getDividerSize(),
      // y2
      0
    ];

    $('.westEastDivider').draggable( 'option', 'containment', containment );
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
          className={'westEastDivider'} />
      </div>
    );
  }
});

module.exports = LayoutMiddleEastDivider;
