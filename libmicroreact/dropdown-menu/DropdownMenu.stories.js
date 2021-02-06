import React from 'react';

import DropdownMenu from './index';
import IconButton from '../icon-button';
import MenuButton from '../menu-button';

const Button = React.forwardRef((props, ref) => (
  <IconButton ref={ref} {...props}>
    <i className="material-icons">settings</i>
  </IconButton>
));

const style = { display: 'flex' };
const alignStyle = { display: 'flex', flexDirection: 'row-reverse' };

export default {
  title: 'Menus/Dropdown Menu',

  decorators: [
    (storyFn, ctx) => (
      <div style={ctx.story.includes('Align') ? alignStyle : style}>
        {storyFn(ctx)}
      </div>
    ),
  ],
};

export const Default = () => (
  <DropdownMenu button={<Button />}>
    <a>Settings</a>
    <button>Bin</button>
    <hr />
    <a>Density and colour</a>
    <button>Print</button>
    <hr />
    <a>Send feedback</a>
    <button>Help</button>
  </DropdownMenu>
);

export const WithAlign = () => (
  <DropdownMenu align="right" button={<Button />}>
    <a>Settings</a>
    <button>Bin</button>
    <hr />
    <a>Density and colour</a>
    <button>Print</button>
    <hr />
    <a>Send feedback</a>
    <button>Help</button>
  </DropdownMenu>
);

export const PWSwitcher = () => {
  const [ table, setTable ] = React.useState('Metadata');
  return (
    <DropdownMenu
      direction="up"
      style={{ marginTop: '50vh' }}
      button={
        <MenuButton direction="up">
          <i className="material-icons">list</i>
          {table}
        </MenuButton>
      }
    >
      <button onClick={() => setTable('Metadata')}>Metadata</button>
      <button onClick={() => setTable('Typing')}>Typing</button>
      <button onClick={() => setTable('Stats')}>Stats</button>
      <hr />
      <button onClick={() => setTable('Antibiotics')}>Antibiotics</button>
      <button onClick={() => setTable('SNPs')}>SNPs</button>
      <button onClick={() => setTable('Genes')}>Genes</button>
    </DropdownMenu>
  );
};
