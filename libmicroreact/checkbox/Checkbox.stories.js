import React from 'react';

import Checkbox from './index';
import Container from './Container.react';

export default {
  title: 'Forms/Checkbox',
  decorators: [ (storyFn, ctx) => <Container>{storyFn(ctx)}</Container> ],
};

export const Default = () => <Checkbox id="checkbox" />;

Default.story = {
  name: 'default',
};

export const Checked = () => <Checkbox id="checkbox" checked />;

Checked.story = {
  name: 'checked',
};

export const WithLabel = () => <Checkbox id="checkbox" label="Check it out" />;

WithLabel.story = {
  name: 'with label',
};

export const WithLabelAsChildren = () => (
  <Checkbox id="checkbox">
    <em>Check</em> it <strong>out</strong>
  </Checkbox>
);

WithLabelAsChildren.story = {
  name: 'with label as children',
};
