var React = require('react');

var MenuLabel = React.createClass({
  render: function () {

    var textStyle = {
      float: 'left',
      fontSize: '14px',
      color: '#333',
      lineHeight: '23px',
      padding: '0 3px 0 5px'
    };

    return (
      <span style={textStyle}>
        Menu:
      </span>
    );
  }
});

module.exports = MenuLabel;
