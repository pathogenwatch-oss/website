var React = require('react');

var IsProjectListed = React.createClass({

  getInitialState: function () {
    return {
      isChecked: this.props.isProjectListed
    };
  },

  handleChange: function (event) {
    this.setState({
      isChecked: !this.state.isChecked
    });

    this.props.handleSetProjectListedOption(!this.state.isChecked);
  },

  render: function () {

    var containerStyle = {
      margin: '20px 0'
    };

    return (
      <div className="checkbox" style={containerStyle}>
        <label>
          <input type="checkbox" checked={this.state.isChecked} onChange={this.handleChange} />
          Would you like your project listed?
        </label>

        <p className="help-block">Listed projects might be promoted on a home page and via Twitter.</p>
      </div>
    );
  }
});

module.exports = IsProjectListed;
