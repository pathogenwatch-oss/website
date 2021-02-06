import React from 'react';

import createLasso from './index';
import theme from '../theme';

const LassoDemo = () => {
  const canvasRef = React.useRef();
  React.useEffect(() => {
    const lasso = createLasso(canvasRef.current, canvasRef.current, {
      clearBeforeDraw: true,
      isActive: true,
    });
    return () => lasso.destroy();
  }, []);
  return (
    <canvas
      ref={canvasRef}
      width="400"
      height="400"
      style={{ display: 'block', margin: '0 auto', border: '1px solid #ccc' }}
    />
  );
};

export default {
  title: 'Core/Canvas Lasso',
};

export const Example = () => <LassoDemo key={theme.primaryColour} />;

Example.story = {
  name: 'example',
};
