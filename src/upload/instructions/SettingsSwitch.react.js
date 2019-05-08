import React from 'react';
import { connect } from 'react-redux';

import Switch from '~/components/switch';

import { getSettingValue } from '../progress/selectors';

import { changeUploadSetting } from '../progress/actions';

function mapStateToProps(state, { setting }) {
  return {
    checked: getSettingValue(state, setting),
  };
}

function mapDispatchToProps(dispatch, { setting }) {
  return {
    onChange: checked => dispatch(changeUploadSetting(setting, checked)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(({ checked, onChange, children }) => (
  <Switch checked={checked} onChange={onChange}>
    {children}
  </Switch>
));
