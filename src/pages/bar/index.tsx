import React, { FC } from 'react';

interface BarProps {}

const Bar: FC<BarProps> = (props) => {
  console.log(props, 'props');
  return (
    <div>柱状图</div>
  );
}

export default React.memo(Bar);
