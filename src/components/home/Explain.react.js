var React = require('react');

var Explain = React.createClass({
  render: function () {

    var containerStyle = {
      fontFamily: '"Lato", sans-serif',
      color: '#000',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    };

    var h2Style = {
      color: '#000',
      fontSize: '24px',
      lineHeight: '34px',
      fontWeight: '600',
      fontFamily: '"Lato", sans-serif',
      margin: '30px 0 30px 0'
    };

    var introStyle = {
      color: '#000',
      fontSize: '24px',
      lineHeight: '34px',
      fontWeight: '600',
      fontFamily: '"Lato", sans-serif',
      margin: '0 0 30px 0'
    };

    var pStyle = {
      textAlign: 'left',
      fontSize: '20px',
      margin: '20px 0',
      fontWeight: '300'
    };

    var tableStyle = {
      fontSize: '20px',
      margin: '40px 0'
    };

    var exampleTableStyle = {
      fontSize: '16px',
      fontWeight: '300',
      margin: '40px 0'
    };

    var fieldNameStyle = {
      fontFamily: 'Inconsolata',
      fontSize: '24px',
      color: '#e74c3c',
      display: 'inline-block',
      margin: '0 10px'
    };

    var fieldDescriptionStyle = {
      fontWeight: '300',
      display: 'inline-block',
      padding: '2px 30px'
    };

    var inlineFieldNameStyle = {
      fontFamily: 'Inconsolata',
      color: '#e74c3c',
    };

    var downloadButtonStyle = {
      display: 'block',
      margin: '10px 10px 10px 0',
      fontSize: '20px'
    };

    var ulStyle = {
      listStyle: 'none',
      margin: 0,
      padding: 0
    };

    var liStyle = {
      display: 'block',
      margin: '10px 0',
      fontSize: '20px',
      fontWeight: '300',
      color: '#000000'
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div style={containerStyle}>

            <div className="col-sm-10 col-sm-offset-1">
              <h2 style={introStyle}>
                Introduction
              </h2>

              <p style={pStyle}>
                Microreact allows you to upload, visualise and explore dendrograms (trees) linked to metadata containing geographic locations. As well as locations, any number of metadata fields can be defined and you can specify colours and/or shapes to display on map/tree. Data without colour/shape definitions are available to display as text labels next to each tree leaf and within tables. A permanent URL is produced for you to share your Microreact.
              </p>

              <h2 style={h2Style}>
                Define
              </h2>

              <p style={pStyle}>
                You require two data files to create a Microreact:

                <ul style={ulStyle}>
                  <li style={liStyle}>1. A <strong>Newick format tree file (nwk)</strong> describing your tree shape.</li>
                  <li style={liStyle}>2. A <strong>Comma-separated value (csv)</strong> file containing your data and properties for your Microreact.</li>
                </ul>
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = Explain;
