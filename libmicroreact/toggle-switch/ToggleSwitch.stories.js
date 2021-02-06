// import './example.scss';

import React from 'react';

import ToggleSwitchComponent from './index';

const ToggleSwitch = props => {
  const [ isChecked, toggle ] = React.useState(props.isChecked);
  return <ToggleSwitchComponent {...props} isChecked={isChecked} onChange={toggle} />;
};

export default {
  title: 'Forms/Toggle Switch',
};

export const Default = () => <ToggleSwitch id="toggle" />;

Default.story = {
  name: 'default',
};

export const Checked = () => <ToggleSwitch id="toggle" isChecked />;

Checked.story = {
  name: 'checked',
};

export const WithLabel = () => (
  <div style={{ width: '160px' }}>
    <ToggleSwitch id="toggle" label="Toggle me" isChecked />
  </div>
);

WithLabel.story = {
  name: 'with label',
};
