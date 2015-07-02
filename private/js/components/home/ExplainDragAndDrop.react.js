var React = require('react');
var SelectStatus = require('./SelectStatus.react');

var ExplainDragAndDrop = React.createClass({
  render: function () {

    var containerStyle = {
      borderBottom: '1px dotted #ccc'
    };

    var sectionStyle = {
      margin: '50px 0',
      fontFamily: '"Lato", sans-serif'
    };

    var h3Style = {
      color: '#000',
      fontSize: '26px',
      lineHeight: '36px',
      fontWeight: '300'
    };

    var listStyle = {
      listStyle: 'none',
      margin: 0,
      padding: 0,
      margin: '40px 0'
    };

    var listItemStyle = {
      display: 'inline-block',
      margin: '20px',
      fontSize: '30px',
      fontWeight: '300',
      color: '#000000'
    };

    return (
      <div className="container-fluid text-center" style={containerStyle}>
        <div className="row">
          <div className="col-md-8 col-md-offset-2">

            <div style={sectionStyle}>
              <h3 style={h3Style}>
                Simply <strong>drag and drop</strong> 2 files anywhere on this page:
              </h3>

              <ul style={listStyle}>
                <li style={listItemStyle}>
                  <SelectStatus isSelected={this.props.isDataProvided} />
                  <span>.csv file</span>
                </li>
                <li style={listItemStyle}>
                  <SelectStatus isSelected={this.props.isTreeProvided} />
                  <span>.nwk file</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = ExplainDragAndDrop;
