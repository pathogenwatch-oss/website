var React = require('react');
var CsvFileRequirements = require('./CsvFileRequirements.react');
var NwkFileRequirements = require('./NwkFileRequirements.react');

var ShortFileRequirements = React.createClass({
  render: function () {
    return (
      <div className="container-fluid text-center">
        <div className="row">
          <div className="col-sm-6 col-md-5 col-md-offset-1 col-lg-4 col-lg-offset-2">

            <CsvFileRequirements />

          </div>

          <div className="col-sm-6 col-md-5 col-lg-4">

            <NwkFileRequirements />

          </div>
        </div>
      </div>
    );
  }
});

module.exports = ShortFileRequirements;
