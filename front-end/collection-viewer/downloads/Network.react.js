import React from 'react';
import { exportFile } from '@cgps/libmicroreact/utils/downloads';

const filename = 'pathogenwatch-clustering';

const DownloadsMenu = () => (
  <>
    <button onClick={() => exportFile('network-png', filename)}>
      Network (.png)
    </button>
    <button onClick={() => exportFile('network-svg', filename)}>
      Network (.svg)
    </button>
  </>
);

export default DownloadsMenu;
