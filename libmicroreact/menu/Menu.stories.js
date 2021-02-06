import React from 'react';

import Menu, { withState } from './index';
import Container from './Container.react';
import Button from '../button';
import IconButton from '../icon-button';

export default {
  title: 'Menus/Base Menu',
  decorators: [
    (storyFn, ctx) => (
      <div style={{ position: 'relative' }}>
        <Container>{storyFn(ctx)}</Container>
      </div>
    ),
  ],
};

export const Default = () => (
  <Menu button={<Button>Menu</Button>}>
    <p>Lorem ipsum</p>
  </Menu>
);

export const Open = () => (
  <Menu open button={<Button>Menu</Button>}>
    <p>Lorem ipsum</p>
  </Menu>
);

export const WithAlignRight = () => (
  <Menu
    open
    align="right"
    button={<Button>Menu</Button>}
    style={{ position: 'absolute', right: 0 }}
  >
    <p>Lorem ipsum</p>
  </Menu>
);

export const WithDynamicHeight = () => (
  <Menu button={<Button>Menu</Button>} style={{ margin: '50px 50px' }}>
    <p style={{ height: '1000px' }}>Lorem ipsum</p>
  </Menu>
);

export const WithCaretIconButton = () => (
  <Menu
    button={
      <IconButton>
        <i className="material-icons">info</i>
      </IconButton>
    }
    caret
  >
    <p>Lorem ipsum</p>
  </Menu>
);

export const WithCaretAlignRight = () => (
  <Menu
    button={
      <IconButton>
        <i className="material-icons">info</i>
      </IconButton>
    }
    caret
    align="right"
    style={{ position: 'absolute', right: 0 }}
  >
    <p>Lorem ipsum</p>
  </Menu>
);

const StatefulMenu = withState(Menu);

export const WithState = () => (
  <StatefulMenu button={<Button>Menu</Button>}>
    <p>I have my own state</p>
  </StatefulMenu>
);

WithState.story = {
  decorators: [],
};

export const WithDirection = () => (
  <Menu button={<Button>Menu</Button>} direction="up" style={{ marginTop: '50vh' }}>
    <p>Lorem ipsum</p>
  </Menu>
);

export const WithDirectionDynamicHeight = () => (
  <Menu button={<Button>Menu</Button>} direction="up" style={{ marginTop: '50vh' }}>
    <p style={{ height: '1000px' }}>Lorem ipsum</p>
  </Menu>
);
