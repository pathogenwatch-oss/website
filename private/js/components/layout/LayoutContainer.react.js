var React = require('react');

var LayoutContainer = React.createClass({
  render: function () {

    var style = {
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    };

    return (
      <div style={style} data-mr-layout="container">
        {this.props.children}
      </div>
    );
  }
});

module.exports = LayoutContainer;
