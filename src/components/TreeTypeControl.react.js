var React = require('react');

var TreeTypeControl = React.createClass({

  handleChange: function (event) {
    var treeType = event.target.value;
    this.props.handleTreeTypeChange(treeType);
  },

  render: function () {
    var treeTypeSelectStyle = {
      width: '140px',
      marginTop: '3px',
      display: 'inline-block'
    };

    return (
      <select className="form-control" style={treeTypeSelectStyle} onChange={this.handleChange} value={this.props.treeType}>
        <option value="rectangular">Rectangular</option>
        <option value="circular">Circular</option>
        <option value="radial">Radial</option>
        <option value="diagonal">Diagonal</option>
        <option value="hierarchy">Hierarchy</option>
      </select>
    );
  }
});

module.exports = TreeTypeControl;
