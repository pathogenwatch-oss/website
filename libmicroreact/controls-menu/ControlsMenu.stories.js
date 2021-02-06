import React from 'react';

import Menu from './index';
import Container from './Container.react';

const style = { display: 'flex' };
const alignStyle = { display: 'flex', flexDirection: 'row-reverse' };

export default {
  title: 'Menus/Controls Menu',
  decorators: [
    (storyFn, ctx) => (
      <div style={ctx.story.includes('Align') ? alignStyle : style}>
        <Container hasSearch={ctx.story.includes('Search')}>{storyFn(ctx)}</Container>
      </div>
    ),
  ],
};

export const Default = () => <Menu />;

export const WithTitle = () => <Menu title="Categories" />;

export const WithActive = () => <Menu active title="Categories" />;

export const WithSummary = () => <Menu title="Categories" summary="Category 1" />;

export const WithSummaryNonActive = () => (
  <Menu title="Categories" active={false} summary="Category 1" />
);

export const WithContent = () => (
  <Menu title="Categories">
    Lorem ipsum
  </Menu>
);

export const WithAlign = () => (
  <Menu title="Categories" align="right">
    Lorem ipsum
  </Menu>
);

export const WithSearch = () => (
  <Menu title="Categories">
    Lorem ipsum
  </Menu>
);

export const WithoutHeader = () => (
  <Menu title="Categories" header={false}>
    Lorem ipsum
  </Menu>
);

export const WithMenuGroup = () => (
  <div className="libmr-ControlsMenu-group">
    <Container>
      <Menu title="Menu 1">Lorem ipsum</Menu>
    </Container>
    <Container>
      <Menu title="Menu 2">Lorem ipsum</Menu>
    </Container>
  </div>
);

export const WithStackedGroup = () => (
  <div className="libmr-ControlsMenu-group stacked">
    <Container>
      <Menu title="Menu 1">Lorem ipsum</Menu>
    </Container>
    <Container>
      <Menu title="Menu 2">Lorem ipsum</Menu>
    </Container>
  </div>
);
