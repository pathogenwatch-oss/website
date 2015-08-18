var React = require('react');
var assign = require('object-assign');

var UploadActionCreators = require('../../actions/UploadActionCreators');
var UploadStore = require('../../stores/UploadStore');

var AssemblyMetadata = require('./AssemblyMetadata.react');
var AssemblyAnalysis = require('./AssemblyAnalysis.react');
var AssemblyWorkspaceHeader = require('./AssemblyWorkspaceHeader.react');
var Map = require('./Map.react');
var AssemblyAnalysisChart = require('./AssemblyAnalysisChart.react');
var UploadWorkspaceNavigation = require('./UploadWorkspaceNavigation.react');
var UploadReviewHeader = require('./UploadReviewHeader.react.js');

var divStyle = {
  background: 'red',
  height: '100%'
};

var AssemblyWorkspace = React.createClass({

  // location: this.props.assembly.location,

  propTypes: {
    assembly: React.PropTypes.object.isRequired,
    totalAssemblies: React.PropTypes.number.isRequired,
  },

  render: function () {
    return (
      <div className="mdl-layout mdl-js-layout mdl-layout--fixed-header">

        <UploadReviewHeader title="Upload Review" />

        <main className="mdl-layout__content">
          <div className="page-content">
            <div className="mdl-grid mdl-grid--no-spacing">
              <div className="mdl-cell mdl-cell--3-col">
                <UploadWorkspaceNavigation totalAssemblies={this.props.totalAssemblies}/>
              </div>
              <div className="mdl-cell mdl-cell--9-col">
                <div className="mdl-grid">
                  <div className="mdl-cell mdl-cell--6-col">
                    <AssemblyWorkspaceHeader text="Metadata" />
                    <AssemblyMetadata assembly={this.props.assembly} />
                  </div>

                  <div className="mdl-cell mdl-cell--6-col">
                    <Map width={400} height={200} label={this.props.assembly.metadata.geography.location || 'Location'} location={[this.props.assembly.metadata.geography.position]}/>
                  </div>

                  <div className="mdl-cell mdl-cell--6-col">
                    <AssemblyWorkspaceHeader text="Analysis" />
                    <AssemblyAnalysis assembly={this.props.assembly} />
                  </div>

                  <div className="mdl-cell mdl-cell--6-col">
                    <AssemblyAnalysisChart analysis={this.props.assembly.analysis} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
});

module.exports = AssemblyWorkspace;
