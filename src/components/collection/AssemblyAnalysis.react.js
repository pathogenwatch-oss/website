var React = require('react');
var AssemblyAnalysisItem = require('./AssemblyAnalysisItem.react');
var AssemblyAnalysisChart = require('./AssemblyAnalysisChart.react');

var fullWidthAndHeightStyle = {
  width: '100%',
  height: '100%'
};

var labelStyle = {
  fontSize: '15px',
  fontWeight: '300',
  lineHeight: '20px',
  textTransform: 'uppercase',
  color: '#777'
};

var AssemblyAnalysis = React.createClass({

  propTypes: {
    assembly: React.PropTypes.object.isRequired
  },

  render: function () {
    var assembly = this.props.assembly;

    if (
      ! assembly.analysis.totalNumberOfNucleotidesInDnaStrings
      || ! assembly.analysis.totalNumberOfContigs
      || ! assembly.analysis.smallestNumberOfNucleotidesInDnaStrings
      || ! assembly.analysis.averageNumberOfNucleotidesInDnaStrings
      || ! assembly.analysis.biggestNumberOfNucleotidesInDnaStrings
      || ! assembly.analysis.contigN50
    ) {
      return (
        <div style={labelStyle}>No assembly information</div>
      );
    }

    return (
      <div className="container-fliud">
        <div className="row">
          <div className="col-md-4">
            <AssemblyAnalysisItem label="total nt" value={assembly.analysis.totalNumberOfNucleotidesInDnaStrings} />
          </div>

          <div className="col-md-4">
            <AssemblyAnalysisItem label="total contigs" value={assembly.analysis.totalNumberOfContigs} />
          </div>

          <div className="col-md-4">
            <AssemblyAnalysisItem label="min contig" value={assembly.analysis.smallestNumberOfNucleotidesInDnaStrings} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <AssemblyAnalysisItem label="mean contig" value={assembly.analysis.averageNumberOfNucleotidesInDnaStrings} />
          </div>

          <div className="col-md-4">
            <AssemblyAnalysisItem label="max contig" value={assembly.analysis.biggestNumberOfNucleotidesInDnaStrings} />
          </div>

          <div className="col-md-4">
            <AssemblyAnalysisItem label="contig n50" value={assembly.analysis.contigN50} />
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <AssemblyAnalysisChart label="Analytics Chart" analysis={assembly.analysis} />
          </div>
        </div>

      </div>
    );
  }
});

module.exports = AssemblyAnalysis;
