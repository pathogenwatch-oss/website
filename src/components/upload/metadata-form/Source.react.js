var React = require('react');
var SourceInput = require('./SourceInput.react');
var Header = require('./Header.react');

var Source = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div>
        <Header text="Source" />
        <form className="form-inline">
          <SourceInput assembly={this.props.assembly} />
        </form>
      </div>
    );
  }
});

module.exports = Source;
