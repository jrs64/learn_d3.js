### d3-scale(比例尺)

​ 比例尺主要就是用于将抽象的数据维度映射到可视化图表当中

- 连续比例尺(Continuous Scales)

  - 根据给定的位于`domain([min, max])`中的 value，返回对应`range([min, max]`中的值

    ```javascript
    const x = d3.scaleLinear().domain([10, 130]).range([0, 960]);

    x(20); // 80
    x(50); // 320

    // invert 根据给定于range的value返回对应的位于domain中的值
    x.invert(80); // 20
    x.invert(320); // 50
    ```

- 分段比例尺(Band Scales)

  -
