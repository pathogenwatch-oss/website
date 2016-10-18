import React from 'react';

import Dropdown from './Dropdown.react';

import { months } from '../utils/Date';

export default ({ min, max, years, onChangeMin, onChangeMax }) => {
  if (!years || years.length === 0) {
    return null;
  }
  return (
    <section className="wgsa-filter__section">
      <h3>Min Date</h3>
      <div className="wgsa-date-filter">
        <Dropdown id="minYear" label="Year" options={years}
          className="wgsa-date-filter__dropdown"
          selected={min.year} fullWidth
          onChange={year => onChangeMin({ year, month: min.month })}
        />
        <Dropdown id="minMonth" label="Month" options={months}
          className="wgsa-date-filter__dropdown"
          selected={min.month ? months[min.month].text : ''} fullWidth
          onChange={month => onChangeMin({ year: min.year, month })}
        />
      </div>
      <h3>Max Date</h3>
      <div className="wgsa-date-filter">
        <Dropdown id="maxYear" label="Year" options={years}
          className="wgsa-date-filter__dropdown"
          selected={max.year} fullWidth
          onChange={year => onChangeMax({ year, month: max.month })}
        />
        <Dropdown id="maxMonth" label="Month" options={months}
          className="wgsa-date-filter__dropdown"
          selected={max.month ? months[max.month].text : ''} fullWidth
          onChange={month => onChangeMax({ year: max.year, month })}
        />
      </div>
    </section>
  );
};
