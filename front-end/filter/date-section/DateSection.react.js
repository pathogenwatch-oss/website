import React from 'react';
import startOfMonth from 'date-fns/start_of_month';
import endOfMonth from 'date-fns/end_of_month';

import FilterSection from '../section';
import DateRange from '../../components/date-range';

export default ({ summary, updateFilter }) => {
  if (summary) {
    const expanded = !!(summary.values[0] || summary.values[1]);
    return (
      <FilterSection
        heading="Date"
        icon="date_range"
        expanded={expanded}
      >
        <DateRange
          bounds={summary.bounds}
          values={summary.values}
          onChangeMin={value => updateFilter('minDate', startOfMonth(value).toISOString())}
          onChangeMax={value => updateFilter('maxDate', endOfMonth(value).toISOString())}
        />
      </FilterSection>
    );
  }
  return null;
};
