var React = require('react');

var About = React.createClass({
  render: function () {

    var containerStyle = {
      fontFamily: '"Lato", sans-serif',
      color: '#000',
      margin: 0,
      padding: '0 0 40px 0',
      overflow: 'hidden'
    };

    var h2Style = {
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
      margin: '20px 0'
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div style={containerStyle}>

            <div className="col-sm-10 col-sm-offset-1">
              <h2 style={h2Style}>
                Microreact has been developed in the <a href="http://www.imperial.ac.uk/people/d.aanensen" target="_blank">Aanensen Research Group</a> at Imperial College London and The Centre for Genomic Pathogen Surveillance.
              </h2>

              <p style={pStyle}>
                Microreact is a React.js application taking full advantage of the Google Maps API (maps) and the <a href="http://phylocanvas.net" target="_blank">PhyloCanvas API</a> (trees).
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = About;
