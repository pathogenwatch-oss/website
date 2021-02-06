import React from 'react';

import Button from './index';

export default {
  title: 'Buttons/Button',
};

export const Default = () => <Button>Click me</Button>;

Default.story = {
  name: 'default',
};

export const Raised = () => <Button raised>Click me</Button>;

Raised.story = {
  name: 'raised',
};
