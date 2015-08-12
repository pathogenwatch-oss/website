var React = require('react');
var Header = require('./Header.react');
var Explain = require('./Explain.react');
var ExplainCsvFormat = require('./ExplainCsvFormat.react');
var ExplainNwkFormat = require('./ExplainNwkFormat.react');
var Credits = require('./Credits.react');

var InstructionsPage = React.createClass({
  render: function () {
    return (
      <div>
        <Header />
        <Explain />
        <ExplainNwkFormat />
        <ExplainCsvFormat />
        <Credits />
      </div>
    );
  }
});

module.exports = InstructionsPage;
