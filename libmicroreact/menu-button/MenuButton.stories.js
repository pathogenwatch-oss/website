import React from 'react';

import MenuButton from './index';

export default {
  title: 'Buttons/Menu Button',
};

export const Default = () => <MenuButton />;

export const WithLabel = () => <MenuButton label="Menu" />;

export const WithChildren = () => (
  <MenuButton>
    <strong>Menu</strong>
  </MenuButton>
);

export const WithDirection = () => (
  <MenuButton direction="up">
    <strong>Menu</strong>
  </MenuButton>
);

export const WithOpen = () => (
  <MenuButton open>
    <strong>Menu</strong>
  </MenuButton>
);

export const WithActive = () => (
  <MenuButton active>
    <strong>Menu</strong>
  </MenuButton>
);

export const WithClear = () => {
  const [ active, setActive ] = React.useState(true);
  return (
    <MenuButton
      active={active}
      clear={active ? (e) => { e.stopPropagation(); setActive(false); } : null}
      onClick={() => setActive(true)}
    >
      {active ? 'Active' : 'Click me'}
    </MenuButton>
  );
};

export const WithIcon = () => (
  <MenuButton>
    <i className="material-icons">access_time</i>
    Timeline
  </MenuButton>
);

export const WithIconActive = () => (
  <MenuButton active>
    <i className="material-icons">access_time</i>
    Timeline
  </MenuButton>
);
