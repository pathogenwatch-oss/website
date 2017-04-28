import React from 'react';
import Range from 'rc-slider/lib/Range';
import format from 'date-fns/format';

import { dateToInteger, integerToDate } from '../../utils/Date';

export default ({ bounds, values = bounds, onChangeMin, onChangeMax }) => {
  const minBounds = dateToInteger(bounds[0]);
  const maxBounds = dateToInteger(bounds[1]);
  const minValue = dateToInteger(values[0]);
  const maxValue = dateToInteger(values[1]);
  return (
    <Range
      min={minBounds}
      max={maxBounds}
      defaultValue={[ minValue, maxValue ]}
      onAfterChange={([ min, max ]) => {
        if (min !== minValue) onChangeMin(integerToDate(min));
        if (max !== maxValue) onChangeMax(integerToDate(max));
      }}
    >
      <span>{format(values[0], 'MMM YYYY')}</span>
      <span>{format(values[1], 'MMM YYYY')}</span>
    </Range>
  );
};
