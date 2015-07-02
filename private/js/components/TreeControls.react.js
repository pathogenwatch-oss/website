var React = require('react');
var TreeControlButton = require('./TreeControlButton.react');
var TreeTypeControl = require('./TreeTypeControl.react');

var TreeControls = React.createClass({

  componentDidMount: function () {
    $('[data-dial-node-size]').knob({
      'min': 1,
      'max': 50,
      'width': 60,
      'angleOffset': -125,
      'angleArc': 250,
      'displayInput': false,
      'change': function (nodeSize) {
        this.props.handleNodeSizeChange(nodeSize);
      }.bind(this)
    });

    $('[data-dial-label-size]').knob({
      'min': 1,
      'max': 50,
      'width': 60,
      'angleOffset': -125,
      'angleArc': 250,
      'displayInput': false,
      'change': function (labelSize) {
        this.props.handleLabelSizeChange(labelSize);
      }.bind(this)
    });
  },

  render: function () {

    var treeControlsStyle = {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '200px',
      textAlign: 'right',
      zIndex: '999',
      paddingTop: '10px',
      paddingRight: '10px'
    };

    var treeSizeControlsStyle = {
      position: 'absolute',
      top: 0,
      left: 25, // hack to allow for history tab
      width: '200px',
      height: 'auto',
      textAlign: 'left',
      zIndex: '999',
      paddingTop: '10px',
      paddingLeft: '10px',
      userSelect: 'none'
    };

    var sizeControlStyle = {
      width: '80px',
      height: '100px',
      display: 'inline-block',
      overflow: 'hidden',
      userSelect: 'none'
    };

    var noUserSelectStyle = {
      userSelect: 'none'
    };

    return (

      <div>

        <div style={treeControlsStyle}>

          <TreeControlButton handleClick={this.props.handleToggleNodeLabels} label={'Toggle Labels'} />
          <TreeControlButton handleClick={this.props.handleToggleNodeAlign} label={'Toggle Node Align'} />
          <TreeControlButton handleClick={this.props.handleRedrawOriginalTree} label={'Redraw Original Tree'} />
          <TreeControlButton handleClick={this.props.handleExportCurrentView} label={'Export Current View'} />

          <TreeTypeControl
            treeType={this.props.treeType}
            handleTreeTypeChange={this.props.handleTreeTypeChange} />

        </div>

        <div style={treeSizeControlsStyle}>

          <div style={sizeControlStyle}>
            <label>Node Size</label>
            <input type="text" data-dial-node-size defaultValue={this.props.nodeSize} style={this.noUserSelectStyle} />
          </div>

          <div style={sizeControlStyle}>
            <label>Label Size</label>
            <input type="text" data-dial-label-size defaultValue={this.props.labelSize} style={this.noUserSelectStyle} />
          </div>

        </div>

      </div>
    );
  }
});

module.exports = TreeControls;
