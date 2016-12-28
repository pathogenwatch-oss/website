import React from 'react';

const size = 100;
const center = size / 2;
const border = 8;
const radius = center - border; // padding to prevent clipping

export default ({ colour = 'black' }) => (
  <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '200%', transform: 'translate(-25%, -25%)' }}>
    <circle cx="50" cy="50" r={radius} fill="none" stroke={colour} strokeWidth={border} />
  </svg>
);
