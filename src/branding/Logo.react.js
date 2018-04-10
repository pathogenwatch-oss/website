import React from 'react';
import { connect } from 'react-redux';

const srcs = {
  WGSA: '/images/WGSA.FINAL.svg',
  Pathogenwatch: '/images/pathogenwatch-saira-semicondensed.svg',
  PathogenDotWatch: '/images/pathogen-dot-watch-saira-caps.svg',
};

const Logo = ({ className, brandingId }) => (
  <img className={className} src={srcs[brandingId]} />
);

function mapStateToProps(state) {
  return {
    brandingId: state.branding.id,
  };
}

export default connect(mapStateToProps)(Logo);
