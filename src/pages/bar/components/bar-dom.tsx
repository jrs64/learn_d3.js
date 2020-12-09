import React, { FC, useEffect, useRef } from 'react';
import { select, scaleBand, range, scaleLinear, max, axisBottom, axisLeft, brushX, min } from 'd3';
import { getBasicBarData, BasicBarData } from '@/services/bar';
import styles from '../index.less';

const color = 'steelblue';

const margin = {
  top: 30,
  right: 20,
  bottom: 30,
  left: 40,
};

interface PropsType {
  height?: number;
  width?: number;
}

const BarDom: FC<PropsType> = (props) => {
  const { height = 500, width = 950 } = props;
  const svg_wrap = useRef(null);

  const showToolTip = (event: any, data: { name: string; value: number }) => {
    select('.tooltip')
      .style('opacity', 1)
      .style('top', `${event.offsetY - 10}px`)
      .style('left', `${event.offsetX + 10}px`)
      .html(`<div>${data.name}: ${data.value}</div>`);
  };

  const initChart = (data: BasicBarData['data']) => {
    const brushHeight = 90;
    const svg = select(svg_wrap.current);
    const tooltip = select('.tooltip');
    const chart = svg.append('g').attr('class', 'chart');
    const content = svg
      .append('g')
      .attr('class', 'content')
      .attr('transform', `translate(0, ${height - brushHeight})`);

    const xScale = scaleBand<number>()
      .domain(range(data.length))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = scaleLinear()
      .domain([0, max(data, (d) => d.value) || 0])
      .nice()
      .range([height - brushHeight - margin.bottom, margin.top]);

    const xScale2 = scaleBand<number>()
      .domain(range(data.length))
      .rangeRound([margin.left, width - margin.right])
      .padding(0.1);

    const yScale2 = scaleLinear()
      .domain([0, max(data, (d) => d.value) || 0])
      .nice()
      .range([70, 0]);

    const bar_rect = chart
      .append('g')
      .attr('fill', color)
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d, i) => xScale(i) || 0)
      .attr('y', (d) => yScale(d.value))
      .attr('height', (d) => yScale(0) - yScale(d.value))
      .attr('width', xScale.bandwidth())
      .on('mouseover', () => {
        tooltip.style('opacity', 1);
      })
      .on('mousemove', showToolTip)
      .on('mouseleave', () => {
        tooltip.transition().duration(100).style('opacity', 0);
      });

    const Xaxis = axisBottom(xScale)
      .tickFormat((i) => data[i].name)
      .tickSizeOuter(0);
    const xAxisGroup = chart
      .append('g')
      .call((g) =>
        g.attr('transform', `translate(0,${height - brushHeight - margin.bottom})`).call(Xaxis),
      );

    chart.append('g').call((g) =>
      g
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(axisLeft(yScale).ticks(null, null))
        .call((line) => line.select('.domain').remove())
        .call((text) =>
          text
            .append('text')
            .attr('x', -margin.left)
            .attr('y', 10)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start')
            .text('Frequency'),
        ),
    );

    // 数据缩放
    content.append('g').call((g) =>
      g.attr('transform', 'translate(0, 70)').call(
        axisBottom(xScale)
          .tickFormat((i) => data[i].name)
          .tickSizeOuter(0),
      ),
    );

    content
      .append('g')
      .attr('class', 'bar-wrapper')
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d, i) => xScale2(i) || 0)
      .attr('y', (d) => yScale2(d.value))
      .attr('width', xScale2.bandwidth())
      .attr('height', (d) => 70 - yScale2(d.value))
      .attr('fill', color);

    const bar_brush = brushX()
      .extent([
        [margin.left, 0.5],
        [width - margin.right, 70],
      ])
      .on('brush', (event) => {
        if (!event.sourceEvent) return;
        if (!event.selection) return;
        const newInput: Array<number> = [];
        const { selection } = event;
        xScale2.domain().forEach((i) => {
          const pos = (xScale2(i) || 0) + xScale2.bandwidth() / 2;
          if (pos >= selection[0] && pos <= selection[1]) {
            newInput.push(i);
          }
        });
        xScale.domain(newInput);

        bar_rect
          .attr('x', (d, i) => xScale(i) || 0)
          .attr('y', (d) => yScale(d.value))
          .attr('width', xScale.bandwidth())
          .attr('height', (d, i) => {
            if (xScale.domain().indexOf(i) === -1) return 0;
            return yScale(0) - yScale(d.value);
          });

        xAxisGroup.call(Xaxis);
      })
      .on('end', (event) => {
        if (!event.sourceEvent) return;
        if (!event.selection) return;
        const newInput: Array<number> = [];
        const { selection } = event;
        xScale2.domain().forEach((i) => {
          const pos = (xScale2(i) || 0) + xScale2.bandwidth() / 2;
          if (pos >= selection[0] && pos <= selection[1]) {
            newInput.push(i);
          }
        });
        const left = xScale2(min(newInput) || 0);
        const right = (xScale2(max(newInput) || 0) || 0) + xScale2.bandwidth();
        select('.brush').transition().call(event.target.move, [left, right]);
      });

    content
      .append('g')
      .attr('class', 'brush')
      .call(bar_brush)
      .call(bar_brush.move, xScale2.range());
  };

  const getData = async () => {
    const { data } = await getBasicBarData();
    initChart(data);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className={styles.basicBar}>
      <svg ref={svg_wrap} style={{ width, height }} viewBox={`0 0 ${width} ${height}`} />
      <div className={`tooltip ${styles.tooltip}`} />
    </div>
  );
};

export default React.memo(BarDom);
