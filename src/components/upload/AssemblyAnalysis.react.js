import React from 'react';
import AssemblyAnalysisItem from './AssemblyAnalysisItem.react';

import Species from '^/species';

const fullWidthAndHeightStyle = {
  width: '100%',
  height: '100%',
};

const labelStyle = {
  fontSize: '15px',
  fontWeight: '300',
  lineHeight: '20px',
  textTransform: 'uppercase',
  color: '#777',
};

const AssemblyAnalysis = React.createClass({

  propTypes: {
    metrics: React.PropTypes.object,
  },

  render() {
    const { metrics } = this.props;
    const { totalNumberOfNucleotidesInDnaStrings, gcContent } = metrics;

    if (!metrics || !Object.keys(metrics).length) {
      return (
        <p className="mdl-card__supporting-text">(Fasta file not provided)</p>
      );
    }

    return (
      <div className="mdl-grid mdl-grid--no-spacing">
        <div className="mdl-cell mdl-cell--6-col">
          <AssemblyAnalysisItem
            label="Assembly Length"
            value={totalNumberOfNucleotidesInDnaStrings}
            error={
              totalNumberOfNucleotidesInDnaStrings > Species.maxAssemblySize
            }
          />
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
          <AssemblyAnalysisItem label="GC Content"
            value={`${metrics.gcContent}%`}
            error={ Species.gcRange &&
              gcContent > Species.gcRange.max ||
              gcContent < Species.gcRange.min
            }
          />
        </div>
      </div>
    );
  },
});

module.exports = AssemblyAnalysis;
