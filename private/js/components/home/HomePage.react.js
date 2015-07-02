var React = require('react');
var Header = require('./Header.react');
var ShortIntroduction = require('./ShortIntroduction.react');
var ExplainDragAndDrop = require('./ExplainDragAndDrop.react');
var ShortFileRequirements = require('./ShortFileRequirements.react');
var Questions = require('./Questions.react');
var Credits = require('./Credits.react');

var HomePage = React.createClass({
  render: function () {
    return (
      <div>
        <Header />
        <ShortIntroduction />
        <ExplainDragAndDrop
          isDataProvided={this.props.isDataProvided}
          isTreeProvided={this.props.isTreeProvided} />

        <ShortFileRequirements />
        <Questions />
        <Credits />
      </div>
    );
  }
});

module.exports = HomePage;
