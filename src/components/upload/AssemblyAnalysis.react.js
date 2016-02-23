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
  color: '#777',
};

var AssemblyAnalysis = React.createClass({

  propTypes: {
    metrics: React.PropTypes.object,
  },

  render: function () {
    const { metrics } = this.props;

    if (!metrics || !Object.keys(metrics).length) {
      return (
        <p className="mdl-card__supporting-text">(Assembly not provided)</p>
      );
    }

    return (
      <div className="mdl-grid mdl-grid--no-spacing">
        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Assembly Length" value={metrics.totalNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="No. Contigs" value={metrics.totalNumberOfContigs} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Smallest Contig" value={metrics.smallestNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Largest Contig" value={metrics.biggestNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Average Contig Length" value={metrics.averageNumberOfNucleotidesInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="N50" value={metrics.contigN50} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="Non-ATCG" value={metrics.totalNumberOfNsInDnaStrings} />
        </div>

        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem label="GC Content" value={`${metrics.gcContent}%`} />
        </div>
      </div>
    );
  }
});

module.exports = AssemblyAnalysis;
