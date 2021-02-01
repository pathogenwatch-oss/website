import React from 'react';

import { isNovel } from './utils';

export default React.createClass({

  componentDidMount() {
    const { id } = this.props;
    if (isNovel(id) && window && window.Clipboard) {
      this.clipboard = new window.Clipboard(this.el, { text: () => id });
    }
  },

  render() {
    const { id, showNovelHash } = this.props;
    if (isNovel(id)) {
      return (
        <span
          ref={el => { this.el = el; }}
          onClick={e => e.stopPropagation()}
          className="wgsa-mlst-profile-hit is-novel"
          title={`Novel allele: ${id}\n(click to copy)`}
        >
          ({showNovelHash ? id.slice(0, 4) : 'novel'})
        </span>
      );
    }
    return <span className="wgsa-mlst-profile-hit">{id}</span>;
  },

});
