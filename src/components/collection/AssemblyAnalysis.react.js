var React = require('react');
var AssemblyAnalysisItem = require('./AssemblyAnalysisItem.react');

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
      <div className="mdl-grid mdl-grid--no-spacing">
        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Assembly Length" value={assembly.analysis.totalNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="No. Contigs" value={assembly.analysis.totalNumberOfContigs} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Smallest Contig" value={assembly.analysis.smallestNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Largest Contig" value={assembly.analysis.biggestNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Average Contig Length" value={assembly.analysis.averageNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="N50" value={assembly.analysis.contigN50} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Total Ns" value={assembly.analysis.totalNumberOfNsInDnaStrings} />
        </div>
      </div>
    );
  }
});

module.exports = AssemblyAnalysis;
