var React = require('react');

var ShortIntroduction = React.createClass({
  render: function () {

    var h2Style = {
      color: '#000',
      fontSize: '24px',
      lineHeight: '34px',
      fontWeight: '600',
      fontFamily: '"Lato", sans-serif',
      margin: 0
    };

    var underlineStyle = {

    };

    return (
      <div className="container-fluid text-center">
        <div className="row">
          <div className="col-sm-10 col-sm-offset-1">
            <h2 style={h2Style}>
              Microreact allows you to upload, visualise and explore dendrograms (trees) linked to metadata containing geographic locations.
            </h2>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ShortIntroduction;
