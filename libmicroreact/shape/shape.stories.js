import React from 'react';

import Shape from './Shape.react';

export default {
  title: 'Core/Shape',
};

export const Default = () => <Shape />;

Default.story = {
  name: 'default',
};

export const WithShape = () => <Shape shape="circle" />;

WithShape.story = {
  name: 'with shape',
};

export const WithColour = () => <Shape shape="circle" colour="red" />;

WithColour.story = {
  name: 'with colour',
};

export const WithHighlight = () => <Shape shape="circle" colour="red" isHighlighted />;

WithHighlight.story = {
  name: 'with highlight',
};

export const WithFlag = () => <Shape shape="gb" />;

WithFlag.story = {
  name: 'with flag',
};

export const WithEmoji = () => <Shape shape="🐢" />;

WithEmoji.story = {
  name: 'with emoji',
};

export const WithSize = () => <Shape shape="circle" colour="red" size={14} />;

WithSize.story = {
  name: 'with size',
};

export const WithWidthAndHeight = () => (
  <Shape shape="circle" colour="red" size={14} width={64} height={64} />
);

WithWidthAndHeight.story = {
  name: 'with width and height',
};

export const WithGiantism = () => (
  <Shape shape="circle" colour="red" isHighlighted size={28} width={128} height={128} />
);

WithGiantism.story = {
  name: 'with giantism',
};
