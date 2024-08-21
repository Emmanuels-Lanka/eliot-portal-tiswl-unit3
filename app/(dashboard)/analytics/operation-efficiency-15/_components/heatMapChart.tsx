import React from 'react';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';

const HeatMapChartNew = () => {
  const options: ApexOptions = {
    chart: {
      height: 350,
      type: 'heatmap',
    },
    dataLabels: {
      enabled: false
    },
    colors: ["#008FFB"],
    title: {
      text: 'HeatMap Chart (Single color)'
    },
  };

  const series = [
    {
      name: 'Series 1',
      data: [
        { x: 'Category 1', y: 10 },
        { x: 'Category 2', y: 20 },
        { x: 'Category 3', y: 30 },
        { x: 'Category 4', y: 40 },
        { x: 'Category 5', y: 50 },
      ]
    },
    {
      name: 'Series 2',
      data: [
        { x: 'Category 1', y: 15 },
        { x: 'Category 2', y: 25 },
        { x: 'Category 3', y: 35 },
        { x: 'Category 4', y: 45 },
        { x: 'Category 5', y: 55 },
      ]
    },
  ];

  return (
    <ReactApexChart options={options} series={series} type="heatmap" height={350} />
  );
};

export default HeatMapChartNew;