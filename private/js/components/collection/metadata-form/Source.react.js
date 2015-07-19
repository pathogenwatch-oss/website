var React = require('react');
var SourceInput = require('./SourceInput.react');

var Source = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  render: function () {
    return (
      <div>
        <label>Source</label>
        <form className="form-inline">
          <SourceInput assembly={this.props.assembly} />
        </form>
      </div>
    );
  }
});

module.exports = Source;
