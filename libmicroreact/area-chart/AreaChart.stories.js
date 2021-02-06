import React from 'react';
import moment from 'moment';

import AreaChart from './index';
import AutoSizer from '../auto-sizer';

import theme from '../theme';
import baseProps from './storyProps';

export default {
  title: 'Charts/Area Chart',
  decorators: [ story => <AutoSizer component={story} /> ],
  component: AreaChart,
};

const StoryAreaChart = (props) => {
  const [ bounds, setBounds ] = React.useState(baseProps.bounds);
  return (
    <AreaChart
      {...baseProps}
      bounds={bounds}
      formatLabel={x => moment(x).format('YYYY-MM-DD')}
      key={theme.primaryColour}
      onBoundsChange={setBounds}
      {...props}
    />
  );
};

StoryAreaChart.propTypes = AreaChart.propTypes;
StoryAreaChart.displayName = 'AreaChart';

export const Default = props => <StoryAreaChart {...props} />;

export const WithLabels = props => <StoryAreaChart {...props} showLabels />;
