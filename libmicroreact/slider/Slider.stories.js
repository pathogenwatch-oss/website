// import './example.scss';

import React from 'react';

import SliderComponent from './index';
import Menu from '../controls-menu';

const Slider = props => {
  const [ value, setValue ] = React.useState(props.value);
  return <SliderComponent {...props} value={value} onChange={setValue} />;
};

export default {
  title: 'Forms/Slider',
};

export const Default = () => <Slider id="slider" label="Value" min={0} max={100} value={50} />;

Default.story = {
  name: 'default',
};

export const InMenu = () => (
  <div style={{ display: 'flex' }}>
    <Menu open title="Categories" toggle={() => {}}>
      <Slider id="slider" label="Value" min={0} max={100} value={50} style={{ width: 320 - 32 }} />
      <Slider id="slider" label="Value" min={0} max={100} value={50} style={{ width: 320 - 32 }} />
    </Menu>
  </div>
);

InMenu.story = {
  name: 'in menu',
};
