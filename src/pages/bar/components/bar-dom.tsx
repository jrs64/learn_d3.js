import React, { FC } from 'react';
import d3 from 'd3';

interface PropsType {

}

const BarDom: FC<PropsType> = () => {
  return (
    <div>柱状图操作dom</div>
  );
};

export default React.memo(BarDom);
