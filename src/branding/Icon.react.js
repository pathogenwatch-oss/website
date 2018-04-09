import React from 'react';
import { connect } from 'react-redux';

const srcs = {
  wgsa: '/images/WGSA.Icon.FINAL.svg',
  pathogenwatch: '/images/pathogenwatch-icon.svg',
  pathogenDotWatch: '/images/pathogenwatch-icon.svg',
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
