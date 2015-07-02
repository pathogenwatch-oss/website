var React = require('react');

var Questions = React.createClass({
  render: function () {

    var containerStyle = {
      borderTop: '1px dotted #ccc'
    };

    var sectionStyle = {
      margin: '60px 0',
      fontFamily: '"Lato", sans-serif'
    };

    var h3Style = {
      color: '#000',
      fontSize: '26px',
      lineHeight: '36px',
      fontWeight: '400',
      margin: '20px 40px'
    };

    var pStyle = {
      textAlign: 'center',
      fontSize: '20px'
    };

    var contactStyle = {
      display: 'inline-block',
      //width: '100%',
      textAlign: 'center',
      margin: '0 5px'
    };

    return (
      <div className="container-fluid text-center" style={containerStyle}>
        <div className="row">
          <div className="col-sm-12">
            <div style={sectionStyle}>
              <h3 style={h3Style}>Questions? Ideas? Feedback?</h3>
              <p style={pStyle}>
                <span style={contactStyle}>
                  <a href="mailto:info@microreact.net">info@microreact.net</a>
                </span>

                <span style={contactStyle}>
                  <a href="https://twitter.com/MyMicroreact" target="_blank"><i className="fa fa-twitter"></i></a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Questions;
