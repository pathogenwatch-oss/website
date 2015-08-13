var React = require('react');

var textStyle = {
  fontSize: '16px',
  fontWeight: '400',
  lineHeight: '20px',
  margin: '25px 0 10px 0'
};

var Header = React.createClass({

  propTypes: {
    text: React.PropTypes.string.isRequired
  },

  render: function () {
    return (
      <h3 style={textStyle}>{this.props.text}</h3>
    );
  }
});

module.exports = Header;
