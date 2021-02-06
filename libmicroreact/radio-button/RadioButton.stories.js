import React from 'react';

import RadioButton from './index';
import Container from './Container.react';

export default {
  title: 'Forms/Radio Button',

  decorators: [ (storyFn, ctx) => <Container>{storyFn(ctx)}</Container> ],
};

export const Default = () => <RadioButton id="radiobutton" />;

Default.story = {
  name: 'default',
};

export const Checked = () => <RadioButton id="radiobutton" checked />;

Checked.story = {
  name: 'checked',
};

export const WithLabel = () => <RadioButton id="radiobutton" label="Video killed the radio star" />;

WithLabel.story = {
  name: 'with label',
};
