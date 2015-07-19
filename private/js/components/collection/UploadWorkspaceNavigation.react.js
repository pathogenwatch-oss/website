var React = require('react');
var assign = require('object-assign');

var AssemblyList = require('./navigation/AssemblyList.react');
var PreviousAssemblyButton = require('./navigation/PreviousAssemblyButton.react');
var NextAssemblyButton = require('./navigation/NextAssemblyButton.react');
var UploadButton = require('./navigation/UploadButton.react');

var containerStyle = {
  borderBottom: '1px solid #bbb'
};

var fullWidthAndHeightStyle = {
  width: '100%',
  height: '100%'
};

var Component = React.createClass({
  render: function () {
    return (
      <div className="container-fliud" style={containerStyle}>
        <div className="row">
          <div className="col-sm-12">

            <form className="form-inline">

              <div className="form-group">

                <AssemblyList />

              </div>

              <div className="form-group">
                <div className="btn-group" role="group" aria-label="...">

                  <PreviousAssemblyButton />
                  <NextAssemblyButton />

                </div>
              </div>

              <div className="form-group">

                  <UploadButton />

              </div>

            </form>

        </div>
      </div>
    </div>

    );
  }
});

module.exports = Component;
