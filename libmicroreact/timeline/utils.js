import moment from 'moment';

export const formatLabel = x => moment(x).format('YYYY-MM-DD');

export function createChartData(points) {
  const data = [];
  const stackSize = {};
  for (const point of points) {
    const x = point.date;
    stackSize[x] = (stackSize[x] || 0) + 1;
    data.push({
      x,
      y: stackSize[x],
      id: point.id,
    });
  }
  return data;
}

export function getTallestStack(chartData) {
  if (chartData.length) {
    let max = chartData[0].y;
    for (const { y } of chartData) {
      max = y > max ? y : max;
    }
    return max;
  }
  return 0;
}

export function createHistogram(points, unit) {
  const groups = {};
  for (const point of points) {
    const m = moment(point.date);
    const keys = [ m.year() ];
    if (unit === 'quarter') {
      keys.push(m.quarter());
    } else if (unit === 'week') {
      keys.push(m.week());
    } else if (unit === 'month') {
      keys.push(m.month() + 1);
    } else if (unit === 'day') {
      keys.push(m.month() + 1);
      keys.push(m.date());
    }
    const key = keys.join('-');
    if (groups[key]) {
      groups[key].y++;
    } else {
      const x = moment({ year: m.year() });
      if (unit === 'quarter') {
        x.set('quarter', m.quarter());
      } else if (unit === 'week') {
        x.set('week', m.week());
      } else if (unit === 'month') {
        x.set('month', m.month());
      } else if (unit === 'day') {
        x.set('month', m.month());
        x.set('date', m.date());
      }
      groups[key] = { x: x.toDate(), y: 1, label: formatLabel(x) };
    }
  }
  return Object.values(groups);
}

export const getInitialBounds = histogram => ({ min: 0, max: histogram.length - 1 });

export const convertBoundsToMoments = ({ min, max }, data) => (
  data.length ? {
    min: moment(data[Math.ceil(min)].x),
    max: moment(data[Math.floor(max)].x),
  } : {}
);

