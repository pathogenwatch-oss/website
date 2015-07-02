var React = require('react');

var Button = React.createClass({
  getInitialState: function () {
    return {
      isActive: this.props.isActive
    };
  },

  handleClick: function () {
    this.setState({
      isActive: !this.state.isActive
    });

    this.props.handleClick();
  },

  render: function () {
    var buttonStyle = {
      marginTop: '5px',
      marginRight: '5px'
    };

    var isActiveStyle = '';

    if (this.props.isActive) {
      isActiveStyle = ' active';
    }

    return (
      <button
        type="button"
        className={'btn btn-default' + isActiveStyle}
        style={buttonStyle}
        onClick={this.handleClick}>{this.props.label}</button>
    );
  }
});

module.exports = Button;
