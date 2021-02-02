import React from 'react';

const DownloadLink = ({ link, ids, children, className }) => (
  <form action={link} method="POST" target="_blank">
    <button className={className}>{children}</button>
    <input type="hidden" name="ids" value={ids} />
  </form>
);

export default DownloadLink;
