var React = require('react');

var Credits = React.createClass({
  render: function () {

    var containerStyle = {
      backgroundColor: '#333333',
      overflow: 'hidden',
      textAlign: 'center',
      fontFamily: '"Lato", sans-serif',
      fontSize: '18px',
      padding: '40px 0'
    };

    var creditsTextStyle = {
      fontWeight: '300',
      color: '#999999',
      display: 'inline-block',
      margin: '10px 40px'
    };

    var imgWellcomeTrustStyle = {
      width: '200px',
      margin: '10px'
    };

    var imgStyle = {
      height: '40px',
      margin: '10px'
    };

    var textStyle = {
      verticalAlign: 'middle'
    }

    return (
      <div className="container-fluid text-center">
        <div className="row">
          <div style={containerStyle}>
            <div className="col-sm-12">
              <div className="text-center">
                <p style={creditsTextStyle}>
                  <span style={textStyle}>Funded by </span>
                  <img src="/images/wellcome_trust_logo.png" style={imgWellcomeTrustStyle} />
                </p>
                <p style={creditsTextStyle}>
                  <span style={textStyle}>Developed at </span>
                  <img src="/images/imperial_logo.png" style={imgStyle} />
                </p>
                <p style={creditsTextStyle}><img src="/images/cgps_logo.png" style={imgStyle} /></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Credits;
