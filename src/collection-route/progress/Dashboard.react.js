import React from 'react';

import Errors from './Errors.react';

import CircularProgress from '../../components/CircularProgress.react';
import Spinner from '../../components/Spinner.react';

import Species from '../../species';

const ProgressIndicator = ({ title, percentage }) => (
  <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--3-col">
    <div className="mdl-card__title mdl-card--expand">
      <CircularProgress radius="40" strokeWidth="8" percentage={Math.floor(percentage) || 0} />
    </div>
    <span className="mdl-card__actions mdl-card--border">{title}</span>
  </div>
);

export default React.createClass({

  propTypes: {
    isUploading: React.PropTypes.bool,
    results: React.PropTypes.object,
    errors: React.PropTypes.array,
    collectionSize: React.PropTypes.number,
  },

  getAssemblyTasks({ CORE, MLST, PAARSNP }, collectionSize) {
    return {
      core: CORE ? CORE / collectionSize * 100 : 0,
      mlst: MLST ? MLST / collectionSize * 100 : 0,
      paarsnp: PAARSNP ? PAARSNP / collectionSize * 100 : 0,
    };
  },

  render() {
    const { collectionSize, results = {}, errors = [] } = this.props;
    const { core, mlst, paarsnp } = this.getAssemblyTasks(results, collectionSize);
    const { noMLST, noAMR } = Species.uiOptions;
    return (
      <div className="mdl-grid">
        <div className="wgsa-upload-progress-section mdl-cell mdl-cell--12-col mdl-shadow--2dp">
          <div className="wgsa-assembly-analyses mdl-grid">
            <ProgressIndicator title={'CORE'} percentage={core} />
            { noMLST ? null : <ProgressIndicator title={'MLST'} percentage={mlst} /> }
            { noAMR ? null : <ProgressIndicator title={'PAARSNP'} percentage={paarsnp} /> }
            <div className="wgsa-overview-upload-ready-card mdl-card mdl-cell mdl-cell--3-col">
              <div className="mdl-card__title mdl-card--expand" style={{ fontSize: '16px' }}>
                { (core >= 100) ? <Spinner /> : 'PENDING' }
              </div>
              <span className="mdl-card__actions mdl-card--border">TREES</span>
            </div>
          </div>
        </div>
        <div className="wgsa-upload-progress-section mdl-cell mdl-cell--12-col mdl-shadow--2dp">
          <div className="wgsa-card-heading">Messages</div>
          <Errors errors={errors} />
        </div>
      </div>
    );
  },

});
