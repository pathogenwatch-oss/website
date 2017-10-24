import React from 'react';

import { isNovel } from './utils';

export default createClass({

  componentDidMount() {
    const { id } = this.props;
    if (isNovel(id) && window && window.Clipboard) {
      this.clipboard = new window.Clipboard(this.el, { text: () => id });
    }
  },

  render() {
    const { id, textOnly } = this.props;
    if (isNovel(id)) {
      return (
        textOnly ?
        <span
          ref={el => { this.el = el; }}
          onClick={e => e.stopPropagation()}
          className="wgsa-mlst-hit"
          title={`Novel Allele: ${id}\n(Click to Copy)`}
        >
          ({id.slice(0, 4)})
        </span> :
        <i
          ref={el => { this.el = el; }}
          onClick={e => e.stopPropagation()}
          className="material-icons wgsa-mlst-profile-hit"
          title={`Novel Allele: ${id}\n(Click to Copy)`}
        >
          new_releases
        </i>
      );
    }
    return <span className="wgsa-mlst-profile-hit">{id}</span>;
  },

});
