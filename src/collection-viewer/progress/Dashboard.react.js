import React from 'react';

import CircularProgress from '../../components/CircularProgress.react';
import Spinner from '../../components/Spinner.react';

import Organisms from '../../organisms';

const ProgressIndicator = ({ title, percentage }) => (
  <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell">
    <div className="mdl-card__title">
      <CircularProgress radius="40" strokeWidth="8" percentage={percentage || 0} />
    </div>
    <span className="mdl-card__actions mdl-card--border">{title}</span>
  </div>
);

export default React.createClass({

  propTypes: {
    results: React.PropTypes.object,
  },

  render() {
    const { results = {} } = this.props;
    const { fp, core, mlst, paarsnp } = results;
    const { noMLST, noAMR, genotyphi, ngmast } = Organisms.uiOptions;

    return (
      <div className="wgsa-genome-analyses">
        <div className="mdl-grid">
          <ProgressIndicator title="CORE" percentage={core} />
          { noMLST ? null : <ProgressIndicator title="MLST" percentage={mlst} /> }
          { noAMR ? null : <ProgressIndicator title="PAARSNP" percentage={paarsnp} /> }
          { genotyphi ? <ProgressIndicator title="GENOTYPHI" percentage={results.genotyphi} /> : null }
          { ngmast ? <ProgressIndicator title="NG-MAST" percentage={results.ngmast} /> : null }
          <div className="wgsa-tree-progress-card">
            <span className="wgsa-tree-progress-card__title mdl-card__actions">TREES</span>
            <div className="wgsa-tree-progress-card__status">
              { (fp >= 100) && <Spinner /> }
              { (fp >= 100) ? 'BUILDING' : 'PENDING' }
            </div>
          </div>
        </div>
      </div>
    );
  },

});
