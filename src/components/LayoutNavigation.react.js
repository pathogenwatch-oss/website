var React = require('react');

var MenuLabel = require('./MenuLabel.react');
var TableMetadata = require('./layout/navigation/TableMetadata.react');
var TableResistanceProfile = require('./layout/navigation/TableResistanceProfile.react');
var DevelopedAtImperialCollegeLondon = require('./DevelopedAtImperialCollegeLondon.react');

var Navigation = React.createClass({
  render: function () {
    return (
      <div data-layout="navigation">
        <MenuLabel />
        <TableMetadata />
        <TableResistanceProfile />
        <DevelopedAtImperialCollegeLondon />
      </div>
    );
  }
});

module.exports = Navigation;
