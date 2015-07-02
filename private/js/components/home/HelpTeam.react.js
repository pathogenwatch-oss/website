var React = require('react');

var HelpTeam = React.createClass({
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
      margin: '0 0 20px 0'
    };

    var h3Style = {
      color: '#000',
      fontSize: '24px',
      lineHeight: '34px',
      fontWeight: '600',
      fontFamily: '"Lato", sans-serif',
      margin: 0
    };

    var pStyle = {
      textAlign: 'left',
      fontSize: '20px',
      margin: '20px 0'
    };

    var teamMemberStyle = {
      margin: '10px 0',
      overflow: 'hidden'
    };

    var thanksStyle = {
      color: '#000',
      fontSize: '24px',
      lineHeight: '34px',
      fontWeight: '300',
      fontFamily: '"Lato", sans-serif',
      margin: '40px 0 10px 0'
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div style={containerStyle}>

            <div className="col-sm-10 col-sm-offset-1">
              <h2 style={h2Style}>
                For suggestions, beta testing and general help thanks to:
              </h2>

              <p style={teamMemberStyle}>
                <h3 style={h3Style}>Silvia Argimón</h3>
              </p>

              <p style={teamMemberStyle}>
                <h3 style={h3Style}>Corinna Glasner</h3>
              </p>

              <p style={teamMemberStyle}>
                <h3 style={h3Style}>Corin Yeats</h3>
              </p>

              <p style={teamMemberStyle}>
                <h3 style={h3Style}>David Alonso García</h3>
              </p>

              <p style={thanksStyle}>We gratefully acknowledge funding by <strong>The Wellcome Trust</strong>.</p>
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = HelpTeam;
