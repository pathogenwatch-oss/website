var React = require('react');
var assign = require('object-assign');

var AssemblyList = require('./navigation/AssemblyList.react');
var PreviousAssemblyButton = require('./navigation/PreviousAssemblyButton.react');
var NextAssemblyButton = require('./navigation/NextAssemblyButton.react');
import '../../css/UploadReview.css';

var containerStyle = {
  borderBottom: '1px solid #cecece',
  background: '#fff',
  margin: '0px',
  height: '1000px'
};

var listStyle = {
  // marginRight: '10px'
};

var title = {
  fontSize: '25px',
  fontWeight: '300',
  lineHeight: '30px',
  margin: '20px 0px 10px 0px',
  textAlign: 'center'
}

var Component = React.createClass({
  render: function () {
    return (
      <div style={containerStyle}>
        <div className="mdl-grid mdl-grid--no-spacing">
          <div className="mdl-cell mdl-cell--12-col">
            <form className="assemblyNavTitle form-inline">
              <div className="form-group">
                <div style={title} className="mdl-badge" data-badge={this.props.totalAssemblies}>
                  <span>Assemblies</span>
                </div>
                <div className="btn-group" role="group" aria-label="...">
                </div>
              </div>
            </form>

            <div className="form-group" style={listStyle}>
              <AssemblyList />
            </div>

          </div>
        </div>
      </div>
    );
  }
});

module.exports = Component;
