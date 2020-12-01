import React, { FC, useEffect, useRef } from 'react';
import { select, scaleBand, range, scaleLinear, max, axisBottom, axisLeft } from 'd3';
import { getBasicBarData, BasicBarData } from '@/services/bar';
import styles from '../index.less';

const color = 'steelblue';

const margin = {
  top: 30,
  right: 0,
  bottom: 30,
  left: 40
};

interface PropsType {
  height?: number;
  width?: number;
}

const BarDom: FC<PropsType> = (props) => {
  const { height = 500, width = 950 } = props;
  const bar = useRef(null);

  const showToolTip = (event: any, data: { name: string; value: number; }) => {
    select('.tooltip')
      .style('opacity', 1)
      .style('top', `${event.offsetY - 10}px`)
      .style('left', `${event.offsetX + 10}px`)
      .html(
        `<div>${data.name}: ${data.value}</div>`
      );
  }

  const init = (data: BasicBarData['data']) => {
    const chart = select(bar.current);
    const tooltip = select('.tooltip');

    const Xaxis = scaleBand<number>()
      .domain(range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const Yaxis = scaleLinear()
      .domain([0, max(data, d => d.value) as number])
      .nice()
      .range([height - margin.bottom, margin.top]);

    chart.append('g')
      .attr('fill', color)
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d, i) => Xaxis(i) as number)
      .attr('y', d => Yaxis(d.value))
      .attr("height", d => Yaxis(0) - Yaxis(d.value))
      .attr("width", Xaxis.bandwidth())
      .on('mouseover', () => {
        tooltip.style('opacity', 1)
      })
      .on('mousemove', showToolTip)
      .on('mouseleave', () => {
        tooltip
          .transition()
          .duration(100)
          .style('opacity', 0)
      });

    chart.append('g').call(
      (g) => g.attr('transform', `translate(0,${height - margin.bottom})`)
      .call(axisBottom(Xaxis).tickFormat(i => data[i].name).tickSizeOuter(0))
    );

    chart.append('g').call(
      (g) => g.attr('transform', `translate(${margin.left}, 0)`)
      .call(axisLeft(Yaxis).ticks(null, null))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", - margin.left)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text('Frequency')
      ) 
    );
  };

  const getData = async() => {
    const { data } = await getBasicBarData();
    init(data);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.basicBar}>
      <svg ref={bar} style={{ width, height }} viewBox={`0 0 ${width} ${height}`} />
      <div className={`tooltip ${styles.tooltip}`} />
    </div>
  );
};

export default React.memo(BarDom);
