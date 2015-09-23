import d3 from 'd3';

const data = [25, 30, 58, 10, 43];

d3.select('body')
  .selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .style('width', '25px')
  .style('height', (d) => {return d + 'px';})
  .style('display', 'inline-block')
  .style('background', 'cyan');
