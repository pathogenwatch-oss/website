import React from 'react';

import Errors from './Errors.react';

import CircularProgress from '../../components/CircularProgress.react';
import Spinner from '../../components/Spinner.react';

import Organisms from '../../organisms';

const ProgressIndicator = ({ title, percentage }) => (
  <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--3-col">
    <div className="mdl-card__title mdl-card--expand">
      <CircularProgress radius="40" strokeWidth="8" percentage={percentage || 0} />
    </div>
    <span className="mdl-card__actions mdl-card--border">{title}</span>
  </div>
);

export default React.createClass({

  propTypes: {
    results: React.PropTypes.object,
    errors: React.PropTypes.array,
  },

  render() {
    const { results = {}, errors = [] } = this.props;
    const { core, mlst, paarsnp } = results;
    const { noMLST, noAMR, genotyphi, ngmast } = Organisms.uiOptions;
    console.log(Organisms)
    return (
      <div className="mdl-grid">
        <div className="mdl-cell mdl-cell--12-col">
          <div className="wgsa-genome-analyses mdl-grid">
            <ProgressIndicator title="CORE" percentage={core} />
            { noMLST ? null : <ProgressIndicator title="MLST" percentage={mlst} /> }
            { noAMR ? null : <ProgressIndicator title="PAARSNP" percentage={paarsnp} /> }
            { genotyphi ? <ProgressIndicator title="GENOTYPHI" percentage={results.genotyphi} /> : null }
            { ngmast ? <ProgressIndicator title="GENOTYPHI" percentage={results.ngmast} /> : null }
            <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--3-col">
              <div className="mdl-card__title mdl-card--expand" style={{ fontSize: '16px' }}>
                { (core >= 100) ? <Spinner /> : 'PENDING' }
              </div>
              <span className="mdl-card__actions mdl-card--border">TREES</span>
            </div>
          </div>
        </div>
        <div className="wgsa-upload-progress-section mdl-cell mdl-cell--12-col">
          <div className="wgsa-card-heading">Warnings</div>
          <Errors errors={errors} />
        </div>
      </div>
    );
  },

});
