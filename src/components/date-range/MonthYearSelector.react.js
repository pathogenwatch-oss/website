import React from 'react';
import format from 'date-fns/format';
import getYear from 'date-fns/get_year';
import getMonth from 'date-fns/get_month';
import minDate from 'date-fns/min';
import maxDate from 'date-fns/max';

import { months } from '../../utils/Date';

export default React.createClass({

  getInitialState() {
    return {
      ...this.parseDates(this.props),
    };
  },

  componentWillReceiveProps(next) {
    if (this.props.editing && !next.editing) {
      this.update();
    } else {
      this.setState(this.parseDates(next));
    }
  },

  setMonth(e) {
    const month = parseInt(e.target.value, 10);
    this.setState({ month });
  },

  setYear(e) {
    const year = parseInt(e.target.value, 10);
    this.setState({ year });
  },

  parseDates({ date, min, max }) {
    return {
      year: getYear(date),
      minYear: getYear(min),
      maxYear: getYear(max),
      month: getMonth(date),
      minMonth: getMonth(min),
      maxMonth: getMonth(max),
    };
  },

  update() {
    const { year, month } = this.state;
    const date = new Date(year, month);

    const nextDate = minDate(this.props.max, maxDate(date, this.props.min));

    const nextYear = getYear(nextDate);
    const nextMonth = getMonth(nextDate);
    const originalYear = getYear(this.props.date);
    const originalMonth = getMonth(this.props.date);

    if (nextYear !== originalYear || nextMonth !== originalMonth) {
      this.props.update(nextDate);
    }
  },

  renderMonths() {
    return months.map(({ text, value }) =>
      <option key={text} value={value}>
        {text.slice(0, 3)}
      </option>
    );
  },

  render() {
    if (!this.props.date) return null;

    if (this.props.editing) {
      const { year, minYear, maxYear, month } = this.state;
      return (
        <form
          ref={el => { this.form = el; }}
          className="wgsa-month-year-selector"
          onSubmit={e => e.preventDefault()}
          onClick={e => e.stopPropagation()}
        >
          <select name="month" value={month} onChange={this.setMonth}>
            {this.renderMonths()}
          </select>
          <input
            name="year" type="number"
            min={minYear} max={maxYear} value={year} onChange={this.setYear}
          />
          <button type="submit" title="Set Date">
            <i className="material-icons">checked</i>
          </button>
        </form>
      );
    }

    return (
      <button onClick={this.props.onClick} title="Edit Date">
        {format(this.props.date, 'MMM YYYY')}
      </button>
    );
  },

});
