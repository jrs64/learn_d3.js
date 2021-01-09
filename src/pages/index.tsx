/* eslint-disable no-console */
import React from 'react';
import { scaleLinear } from 'd3';

const IndexPage = () => {
  const init = () => {
    const xScale = scaleLinear().domain([10, 130]).range([0, 960]);

    console.log(xScale(20)); // 80
    console.log(xScale(50)); // 320
    console.log(xScale.invert(80));
  };

  init();

  return <div>这里是首页</div>;
};

export default IndexPage;
