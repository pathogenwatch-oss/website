import React from 'react';

import RadioSelect from './index';


const StoryRadioSelect = ({ items, value = null }) => {
  const [ _value, setValue ] = React.useState(value);
  return (
    <div style={{ width: 300 }}>
      <RadioSelect
        items={items}
        onChange={setValue}
        value={_value}
      />
    </div>
  );
};

StoryRadioSelect.propTypes = RadioSelect.propTypes;
StoryRadioSelect.displayName = 'RadioSelect';

const items = [
  { label: 'Item 1', value: '1' },
  { label: 'Item 2', value: '2' },
  { label: 'Item 3', value: '3' },
];

export default {
  title: 'Forms/Radio-Select',
};

export const Default = () => <StoryRadioSelect items={items} />;

export const WithValue = () => <StoryRadioSelect items={items} value="2" />;
