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
      ! assembly.metrics.totalNumberOfNucleotidesInDnaStrings
      || ! assembly.metrics.totalNumberOfContigs
      || ! assembly.metrics.smallestNumberOfNucleotidesInDnaStrings
      || ! assembly.metrics.averageNumberOfNucleotidesInDnaStrings
      || ! assembly.metrics.biggestNumberOfNucleotidesInDnaStrings
      || ! assembly.metrics.contigN50
    ) {
      return (
        <p className="mdl-card__supporting-text">(Assembly not provided)</p>
      );
    }

    return (
      <div className="mdl-grid mdl-grid--no-spacing">
        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Assembly Length" value={assembly.metrics.totalNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="No. Contigs" value={assembly.metrics.totalNumberOfContigs} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Smallest Contig" value={assembly.metrics.smallestNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Largest Contig" value={assembly.metrics.biggestNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Average Contig Length" value={assembly.metrics.averageNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="N50" value={assembly.metrics.contigN50} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="N Count" value={assembly.metrics.totalNumberOfNsInDnaStrings} />
        </div>
      </div>
    );
  }
});

module.exports = AssemblyAnalysis;
