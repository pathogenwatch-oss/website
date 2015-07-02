var React = require('react');

var NwkFileRequirements = React.createClass({
  render: function () {

    var sectionStyle = {
      margin: '70px 0',
      fontFamily: '"Lato", sans-serif',
      color: '#000'
    };

    var h3Style = {
      color: '#000',
      fontSize: '30px',
      lineHeight: '36px',
      fontWeight: '400',
      margin: '20px 0',
      color: '#e74c3c'
    };

    var pStyle = {
      textAlign: 'left',
      fontSize: '20px',
      fontWeight: '300'
    };

    var codeStyle = {
      fontFamily: 'Inconsolata',
      color: '#e74c3c'
    };

    return (
      <div style={sectionStyle}>
        <h3 style={h3Style}>.nwk file?</h3>
        <p style={pStyle}>
          This is your <strong>tree</strong> file which must be in valid Newick format.
        </p>

        <p style={pStyle}>
          Every leaf label must correspond to an <span style={codeStyle}>id</span> that is specified in your <span style={codeStyle}>.csv</span> file.
        </p>

        <p style={pStyle}>
          Number of labels in <span style={codeStyle}>.nwk</span> file must match number of <span style={codeStyle}>id</span>s in <span style={codeStyle}>.csv</span> file.
        </p>
      </div>
    );
  }
});

module.exports = NwkFileRequirements;
