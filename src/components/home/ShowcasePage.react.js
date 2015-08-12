var React = require('react');
var Header = require('./Header.react');
var Showcase = require('./Showcase.react');
var Credits = require('./Credits.react');

var ShowcasePage = React.createClass({
  render: function () {
    return (
      <div>
        <Header />
        <Showcase />
        <Credits />
      </div>
    );
  }
});

module.exports = ShowcasePage;
