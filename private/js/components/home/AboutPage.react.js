var React = require('react');
var Header = require('./Header.react');
var About = require('./About.react');
var Team = require('./Team.react');
var HelpTeam = require('./HelpTeam.react');
var Contact = require('./Contact.react');
var Credits = require('./Credits.react');

var AboutPage = React.createClass({
  render: function () {
    return (
      <div>
        <Header />
        <About />
        <Team />
        <HelpTeam />
        <Contact />
        <Credits />
      </div>
    );
  }
});

module.exports = AboutPage;
