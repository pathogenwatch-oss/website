var React = require('react');

var Contact = React.createClass({
  render: function () {

    var containerStyle = {
      fontFamily: '"Lato", sans-serif',
      color: '#000',
      margin: 0,
      padding: '40px 0 40px 0',
      overflow: 'hidden',
      borderTop: '1px dotted #ccc'
    };

    var contactStyle = {
      fontSize: '26px',
      display: 'inline-block',
      margin: '0 30px 0 0'
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div style={containerStyle}>

            <div className="col-sm-10 col-sm-offset-1">

              <p style={contactStyle}>
                <a href="mailto:info@microreact.net">info@microreact.net</a>
              </p>

              <p style={contactStyle}>
                <a href="https://twitter.com/MyMicroreact"><i className="fa fa-twitter"></i></a>
              </p>

            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = Contact;
