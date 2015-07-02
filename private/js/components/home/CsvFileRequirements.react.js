var React = require('react');

var CsvFileRequirements = React.createClass({
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

    var tableStyle = {
      fontSize: '18px',
      fontWeight: '300'
    };

    var codeStyle = {
      fontFamily: 'Inconsolata',
      color: '#e74c3c'
    };

    return (
      <div style={sectionStyle}>
        <h3 style={h3Style}>.csv file?</h3>
        <p style={pStyle}>
          This is your <strong>data</strong> file.
          Every row must contain the following 3 non-empty and valid fields:
        </p>

        <table className="table text-left" style={tableStyle}>
          <tbody>
            <tr>
              <td style={codeStyle}>id</td>
              <td>Must be unique.<br/> Must not contain full stops and commas.</td>
            </tr>
            <tr>
              <td style={codeStyle}>__latitude</td>
              <td>Decimal.</td>
            </tr>
            <tr>
              <td style={codeStyle}>__longitude</td>
              <td>Decimal.</td>
            </tr>
          </tbody>
        </table>

        <p style={pStyle}>
          If unknown, you can find the latitude and longitude for a certain location using <a href="http://www.spatialepidemiology.net/user_maps" target="_blank">this service</a>.
        </p>
      </div>
    );
  }
});

module.exports = CsvFileRequirements;
