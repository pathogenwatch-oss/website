var React = require('react');

var DevelopedAtImperialCollegeLondon = React.createClass({
  render: function () {

    var developedAtStyle = {
      position: 'absolute',
      top: '3px',
      right: '5px',
      fontSize: '12px',
      color: '#888'
    };

    return (
      <span style={developedAtStyle}>
        Developed at Imperial College London
      </span>
    );
  }
});

module.exports = DevelopedAtImperialCollegeLondon;
