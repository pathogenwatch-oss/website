var React = require('react');

var SelectStatus = React.createClass({

  propTypes: {
    isSelected: React.PropTypes.bool.isRequired
  },

  render: function () {
    var style = {
      display: 'block',
      margin: '20px'
    };

    if (this.props.isSelected) {
      return (<span style={style} className="glyphicon glyphicon-ok" aria-hidden="true"></span>);
    } else {
      return (<span style={style} className="glyphicon glyphicon-unchecked" aria-hidden="true"></span>);
    }
  }
});

module.exports = SelectStatus;
