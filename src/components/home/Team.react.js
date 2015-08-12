var React = require('react');

var Team = React.createClass({
  render: function () {

    var containerStyle = {
      fontFamily: '"Lato", sans-serif',
      color: '#000',
      margin: 0,
      padding: '40px 0 40px 0',
      overflow: 'hidden',
      borderTop: '1px dotted #ccc'
    };

    var h2Style = {
      color: '#000',
      fontSize: '24px',
      lineHeight: '34px',
      fontWeight: '300',
      fontFamily: '"Lato", sans-serif',
      margin: '0 0 30px 0'
    };

    var h3Style = {
      color: '#000',
      fontSize: '24px',
      lineHeight: '34px',
      fontWeight: '600',
      fontFamily: '"Lato", sans-serif'
    };

    var pStyle = {
      textAlign: 'left',
      fontSize: '20px',
      margin: '20px 0'
    };

    var teamMemberStyle = {
      margin: '40px 0'
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div style={containerStyle}>

            <div className="col-sm-10 col-sm-offset-1">
              <h2 style={h2Style}>
                Developed by:
              </h2>

              <p style={teamMemberStyle}>
                <h3 style={h3Style}>Artemij Fedosejev</h3>
                <h4>Lead React.js Developer</h4>
              </p>

              <p style={teamMemberStyle}>
                <h3 style={h3Style}>Richard Goater</h3>
                <h4>Node.js and PhyloCanvas Developer</h4>
              </p>

              <p style={teamMemberStyle}>
                <h3 style={h3Style}>Jyothish NT</h3>
                <h4>PhyloCanvas Developer</h4>
              </p>

              <p style={teamMemberStyle}>
                <h3 style={h3Style}>Stephano</h3>
                <h4>Retired Developer</h4>
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = Team;
