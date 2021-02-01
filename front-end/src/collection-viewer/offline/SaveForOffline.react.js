import React from 'react';
// import classnames from 'classnames';

import Checkbox from '@cgps/libmicroreact/checkbox';

import { statuses } from './constants';

import { isSupported } from '~/offline/utils';

const StatusMessage = ({ status }) => {
  switch (status) {
    case statuses.SAVING:
      return 'saving data...';
    case statuses.ERRORED:
      return 'sorry, something went wrong.';
    default:
      return 'page will refresh once saved.';
  }
};

const SaveForOffline = ({ status, checkStatus, onSave }) => {
  const supported = isSupported();

  React.useEffect(() => {
    if (supported) {
      checkStatus();
    }
  }, []);

  const [ saved, setSaved ] = React.useState(status === statuses.SAVED);

  React.useEffect(() => {
    if (!saved && status === statuses.SAVED) {
      setSaved(true);
    }
  }, [ status ]);

  if (!supported) {
    return (
      <div className="wgsa-save-for-offline unsupported">
        <h4>Offline mode</h4>
        <p>
          Unsupported by your browser.
        </p>
      </div>
    );
  }

  const onChange = () => {
    if (saved) return;
    setSaved(true);
    onSave();
  };

  return (
    <div className="wgsa-save-for-offline supported">
      <h4>Offline mode</h4>
      <Checkbox
        id="save-for-offline"
        key="checkbox"
        checked={saved}
        onChange={onChange}
      >
        { status === statuses.SAVED ?
          <span>
            <strong>Saved for offline use</strong>
            <br />
            <a href="/offline" target="_blank" rel="noopener">
              manage offline collections
            </a>
          </span> :
          <span>
            <strong>Save for offline use</strong>
            <br />
            <StatusMessage status={status} />
          </span> }
      </Checkbox>
    </div>
  );
};

export default SaveForOffline;
