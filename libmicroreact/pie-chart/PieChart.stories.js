import React from 'react';

import PieChart from './PieChart.react';

const slices = {
  red: 1 / 6,
  green: 2 / 6,
  blue: 3 / 6,
};

export default {
  title: 'Core/Pie Chart',
};

export const Default = () => <PieChart />;

Default.story = {
  name: 'default',
};

export const WithSlices = () => <PieChart slices={slices} />;

WithSlices.story = {
  name: 'with slices',
};

export const WithHighlight = () => <PieChart slices={slices} isHighlighted />;

WithHighlight.story = {
  name: 'with highlight',
};

export const WithSize = () => <PieChart slices={slices} size={14} />;

WithSize.story = {
  name: 'with size',
};

export const WithWidthAndHeight = () => (
  <PieChart slices={slices} size={14} width={64} height={64} />
);

WithWidthAndHeight.story = {
  name: 'with width and height',
};

export const WithGiantism = () => (
  <PieChart slices={slices} isHighlighted size={28} width={128} height={128} />
);

WithGiantism.story = {
  name: 'with giantism',
};
