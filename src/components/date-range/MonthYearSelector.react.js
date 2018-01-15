import React from 'react';
import format from 'date-fns/format';
import getYear from 'date-fns/get_year';
import getMonth from 'date-fns/get_month';
import isEqual from 'date-fns/is_equal';
import minDate from 'date-fns/min';
import maxDate from 'date-fns/max';

import { months } from '../../utils/Date';

export default React.createClass({

  getInitialState() {
    return {
      open: false,
      ...this.parseDates(this.props),
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState(this.parseDates(nextProps));
  },

  setMonth(e) {
    const month = parseInt(e.target.value, 10);
    this.setState({ month });
  },

  setYear(e) {
    const year = parseInt(e.target.value, 10);
    const { minYear, maxYear, minMonth, maxMonth } = this.state;
    let month = this.state.month;
    if (year === minYear && month < minMonth) month = minMonth;
    if (year === maxYear && month > maxMonth) month = maxMonth;
    this.setState({ year, month });
  },

  parseDates({ date, min, max }) {
    return {
      year: getYear(date),
      minYear: getYear(min),
      maxYear: getYear(max),
      month: getMonth(date),
      minMonth: getMonth(this.props.min),
      maxMonth: getMonth(this.props.max),
    };
  },

  open() {
    this.setState({ open: true, ...this.parseDates(this.props) });
  },

  submit(e) {
    e.preventDefault();
    const { year, month } = this.state;
    this.setState({ open: false });
    const date = new Date(year, month);
    if (!isEqual(date, this.props.date)) {
      this.props.update(minDate(this.props.max, maxDate(date, this.props.min)));
    }
  },

  cancel(e) {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ open: false });
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

    if (this.state.open) {
      const { year, minYear, maxYear, month } = this.state;
      return (
        <form
          ref={el => { this.form = el; }}
          className="wgsa-date-selector"
          onSubmit={this.submit}
          onClick={e => e.stopPropagation()}
        >
          <select name="month" value={month} onChange={this.setMonth}>
            {this.renderMonths()}
          </select>
          <input
            name="year" type="number"
            min={minYear} max={maxYear} value={year} onChange={this.setYear}
          />
          <button type="submit" className="mdl-button mdl-button--icon">
            <i className="material-icons">checked</i>
          </button>
          <button className="mdl-button mdl-button--icon" onClick={this.cancel}>
            <i className="material-icons">close</i>
          </button>
        </form>
      );
    }

    return (
      <span onClick={this.open}>
        {format(this.props.date, 'MMM YYYY')}
      </span>
    );
  },

});
