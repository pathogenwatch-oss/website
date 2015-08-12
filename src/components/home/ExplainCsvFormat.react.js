var React = require('react');

var ExplainCsvFormat = React.createClass({
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
      margin: '30px 0 30px 0'
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
      display: 'inline-block',
      margin: '10px 10px 10px 0',
      fontSize: '20px'
    };

    var shapeImageStyle = {
      width: '13px'
    };

    return (
      <div className="container-fluid">
        <div className="row">
          <div style={containerStyle}>

            <div className="col-sm-10 col-sm-offset-1">
              <h2 style={h2Style}>
                Comma Separated Value (csv) file
              </h2>

              <p style={pStyle}>
                This contains multiple columns/rows of data relating to leaf labels in your Newick file.
              </p>

              <h2 style={h2Style}>
                Required columns
              </h2>

              <p style={pStyle}>
              Your <span style={inlineFieldNameStyle}>csv</span> file must contain at least the following columns:
              </p>

              <table className="table" style={tableStyle}>
                <tbody>

                  <tr>
                    <td>
                      <span style={fieldNameStyle}>id</span>
                    </td>
                    <td>
                      <span style={fieldDescriptionStyle}>
                        An identifier for your data row corresponding to a leaf label
                        within your Newick file – you <strong>MUST</strong> include an <span style={inlineFieldNameStyle}>id</span> for every leaf label.
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span style={fieldNameStyle}>__latitude</span>
                    </td>
                    <td>
                      <span style={fieldDescriptionStyle}>Decimal latitude (WGS84).</span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span style={fieldNameStyle}>__longitude</span>
                    </td>
                    <td>
                      <span style={fieldDescriptionStyle}>Decimal longitude (WGS84).</span>
                    </td>
                  </tr>

                </tbody>
              </table>

              <p style={pStyle}>
                If you need to geocode data you can use the following tool: <a href="http://www.spatialepidemiology.net/user_maps" target="_blank">www.spatialepidemiology.net/user_maps</a>
              </p>

              <h2 style={h2Style}>
                Optional columns
              </h2>

              <p style={pStyle}>
              In addition your csv file can contain the following columns:
              </p>

              <table className="table" style={tableStyle}>
                <tbody>

                  <tr>
                    <td>
                      <span style={fieldNameStyle}>ColumnName__colour</span>
                    </td>
                    <td>
                      <span style={fieldDescriptionStyle}>Assign a specific colour to a data attribute.</span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span style={fieldNameStyle}>ColumnName__shape</span>
                    </td>
                    <td>
                      <span style={fieldDescriptionStyle}>Assign a specific shape to a data attribute.</span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span style={fieldNameStyle}>ColumnName__groupcolour</span>
                    </td>
                    <td>
                      <span style={fieldDescriptionStyle}>Assign a specific colour to a group of entries that have the same <span style={inlineFieldNameStyle}>__latitude</span> and <span style={inlineFieldNameStyle}>__longitude</span>.</span>
                    </td>
                  </tr>

                </tbody>
              </table>

              <p style={pStyle}>
                You can define any number of attribute columns which will be available for you to display as text labels within your Microreact.
              </p>

              <h2 style={h2Style}>
                Example - Defining colour
              </h2>

              <p style={pStyle}>
                If you had a column named <span style={inlineFieldNameStyle}>Country</span> you would add a column called <span style={inlineFieldNameStyle}>Country__colour</span> containing colour values.
                Colours are defined using standard HEX codes or short names. A colour wheel allowing you to pick colours can be found here: <a href="http://www.colorpicker.com" target="_blank">www.colorpicker.com</a>.
              </p>

              <h2 style={h2Style}>
                Example - Defining shape
              </h2>

              <p style={pStyle}>
                If you had a column named <span style={inlineFieldNameStyle}>Country</span> you would add a column called <span style={inlineFieldNameStyle}>Country__shape</span>.
              </p>

              <p style={pStyle}>
              Shapes are defined using one of the following values:
              </p>

              <table className="table" style={tableStyle}>
                <tbody>

                  <tr>
                    <td>
                      <span style={fieldNameStyle}>circle</span>
                    </td>
                    <td>
                      <span style={fieldDescriptionStyle}>
                        <img src="/images/instructions/shape_circle.png" style={shapeImageStyle} />
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span style={fieldNameStyle}>square</span>
                    </td>
                    <td>
                      <span style={fieldDescriptionStyle}>
                        <img src="/images/instructions/shape_square.png" style={shapeImageStyle} />
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span style={fieldNameStyle}>star</span>
                    </td>
                    <td>
                      <span style={fieldDescriptionStyle}>
                        <img src="/images/instructions/shape_star.png" style={shapeImageStyle} />
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <span style={fieldNameStyle}>triangle</span>
                    </td>
                    <td>
                      <span style={fieldDescriptionStyle}>
                        <img src="/images/instructions/shape_triangle.png" style={shapeImageStyle} />
                      </span>
                    </td>
                  </tr>

                </tbody>
              </table>

              <h2 style={h2Style}>
                Example csv file
              </h2>

              <p style={pStyle}>
                For the newick file described above (mammalian species) we will define a <span style={inlineFieldNameStyle}>__latitude</span> and <span style={inlineFieldNameStyle}>__longitude</span> for each species, along with a couple of other metadata columns: country of sample and  pedalism (whether two or four legged). We will also define a <span style={inlineFieldNameStyle}>__colour</span> and a <span style={inlineFieldNameStyle}>__shape</span> for each different country.
              </p>

              <table className="table" style={exampleTableStyle}>
              	<thead>
              		<tr>
              			<th>id</th>
              			<th>__latitude</th>
              			<th>__longitude</th>
              			<th>Country</th>
              			<th>Country__colour</th>
              			<th>Country__shape</th>
              			<th>Pedalism</th>
              		</tr>
              	</thead>
              	<tbody>
              		<tr>
              			<td>Bovine</td>
              			<td>46.227638</td>
              			<td>2.213749</td>
              			<td>France</td>
              			<td>Red</td>
              			<td>square</td>
              			<td>Four</td>
              		</tr>
              		<tr>
              			<td>Gibbon</td>
              			<td>15.870032</td>
              			<td>100.992541</td>
              			<td>Thailand</td>
              			<td>Green</td>
              			<td>circle</td>
              			<td>Two</td>
              		</tr>
              		<tr>
              			<td>Orangutan</td>
              			<td>-0.589724</td>
              			<td>101.3431058</td>
              			<td>Sumatra</td>
              			<td>Blue</td>
              			<td>circle</td>
              			<td>Two</td>
              		</tr>
              		<tr>
              			<td>Gorilla</td>
              			<td>1.373333</td>
              			<td>32.290275</td>
              			<td>Uganda</td>
              			<td>#CC33FF</td>
              			<td>circle</td>
              			<td>Two</td>
              		</tr>
              		<tr>
              			<td>Chimp</td>
              			<td>-0.228021</td>
              			<td>15.827659</td>
              			<td>Congo</td>
              			<td>Orange</td>
              			<td>circle</td>
              			<td>Two</td>
              		</tr>
              		<tr>
              			<td>Human</td>
              			<td>55.378051</td>
              			<td>-3.435973</td>
              			<td>UK</td>
              			<td>#CCFF33</td>
              			<td>circle</td>
              			<td>Two</td>
              		</tr>
              		<tr>
              			<td>Mouse</td>
              			<td>40.463667</td>
              			<td>-3.74922</td>
              			<td>Spain</td>
              			<td>#00FFFF</td>
              			<td>square</td>
              			<td>Four</td>
              		</tr>
              	</tbody>
              </table>

              <p style={pStyle}>
                You can view the demo project here: <a href="http://microreact.org/project/Ny8H4gsH">microreact.org/project/Ny8H4gsH</a>
              </p>

              <p style={pStyle}>
                Or download and create for yourself:
                <br />
                <a href="/files/demo.csv" style={downloadButtonStyle}>Download CSV</a>
                <a href="/files/demo.nwk" style={downloadButtonStyle}>Download NWK</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExplainCsvFormat;
