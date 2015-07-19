var React = require('react');
var assign = require('object-assign');

var AssemblyList = require('./navigation/AssemblyList.react');
var PreviousAssemblyButton = require('./navigation/PreviousAssemblyButton.react');
var NextAssemblyButton = require('./navigation/NextAssemblyButton.react');
var UploadButton = require('./navigation/UploadButton.react');

var containerStyle = {
  borderBottom: '1px solid #cecece',
  padding: '10px 0'
};

var listStyle = {
  marginRight: '10px'
};

var Component = React.createClass({
  render: function () {
    return (
      <div style={containerStyle}>
        <div className="container">
          <div className="row">
            <div className="col-sm-10">

              <form className="form-inline">
                <div className="form-group" style={listStyle}>

                  <AssemblyList />

                </div>

                <div className="form-group">
                  <div className="btn-group" role="group" aria-label="...">

                    <PreviousAssemblyButton />
                    <NextAssemblyButton />

                  </div>
                </div>
              </form>

            </div>

            <div className="col-sm-2 text-right">
              <UploadButton />
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = Component;
