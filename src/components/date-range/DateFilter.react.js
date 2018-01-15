import React from 'react';
import Range from 'rc-slider/lib/Range';
import format from 'date-fns/format';
import endOfMonth from 'date-fns/end_of_month';
import classnames from 'classnames';

import MonthYearSelector from './MonthYearSelector.react';

import { dateToInteger, integerToDate } from '../../utils/Date';

export default React.createClass({

  getInitialState() {
    const [ min, max ] = this.props.values;
    return { min, max };
  },

  componentWillReceiveProps(nextProps) {
    const [ min, max ] = nextProps.values;
    this.setState({ min, max });
  },

  isInactive() {
    const [ min, max ] = this.props.values;
    return !min && !max;
  },

  render() {
    const { bounds, values = bounds, onChangeMin, onChangeMax } = this.props;
    const minBound = dateToInteger(bounds[0]);
    const maxBound = dateToInteger(bounds[1]);
    const minDate = this.state.min || bounds[0];
    const maxDate = this.state.max || bounds[1];
    const minValue = dateToInteger(minDate);
    const maxValue = dateToInteger(maxDate);
    return (
      <div className="wgsa-date-range">
        <Range
          min={minBound}
          max={maxBound}
          value={[ minValue, maxValue ]}
          onChange={([ min, max ]) => this.setState({ min: integerToDate(min), max: endOfMonth(integerToDate(max)) })}
          onAfterChange={([ min, max ]) => {
            if (min !== (values[0] ? dateToInteger(values[0]) : minBound)) {
              onChangeMin(integerToDate(min));
            }
            if (max !== (values[1] ? dateToInteger(values[1]) : maxBound)) {
              onChangeMax(endOfMonth(integerToDate(max)));
            }
          }}
          className={classnames({ 'rc-slider--inactive': this.isInactive() })}
        />
        <label>
          <MonthYearSelector
            date={minDate}
            min={bounds[0]}
            max={maxDate}
            update={onChangeMin}
          />
          <MonthYearSelector
            date={maxDate}
            min={minDate}
            max={bounds[1]}
            update={onChangeMax}
          />
        </label>
      </div>
    );
  },

});
