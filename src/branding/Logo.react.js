import React from 'react';
import { connect } from 'react-redux';

const srcs = {
  wgsa: '/images/WGSA.FINAL.svg',
  pathogenwatch: '/images/pathogenwatch-saira-semicondensed.svg',
  pathogenDotWatch: '/images/pathogen-dot-watch-saira-caps.svg',
};

const Logo = ({ className, brandingId = 'wgsa' }) => (
  <img className={className} src={srcs[brandingId]} />
);

function mapStateToProps(state) {
  return {
    brandingId: state.branding.id,
  };
}

export default connect(mapStateToProps)(Logo);
