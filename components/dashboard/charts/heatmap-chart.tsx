import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface HeatmapChartProps {
    xAxisLabel: string;
    height: number;
}

const HeatmapChart = ({
    xAxisLabel,
    height
}: HeatmapChartProps) => {
    const series = [
        { name: '1st Hour', data: [0, 1, 30] },
        { name: '2nd Hour', data: [20, 30, 41] },
        { name: '3rd Hour', data: [30, 40, 50] },
        { name: '4th Hour', data: [40, 50, 60] },
        { name: '5th Hour', data: [50, 60, 70] },
        { name: '6th Hour', data: [60, 70, 80] },
        { name: '7th Hour', data: [70, 0, 90] },
        { name: '8th Hour', data: [80, 90, 100] },
        { name: '9th Hour', data: [90, 100, 55] },
        { name: '10th Hour', data: [90, 46, 100] },
        { name: '11th Hour', data: [90, 100, 11] },
        { name: '12th Hour', data: [90, 100, 10] }
    ];

    const options = {
        chart: {
            type: 'heatmap' as const,
        },
        plotOptions: {
            heatmap: {
                enableShades: false,
                radius: 30,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        { from: -1, to: 0, name: 'No Data', color: '#374151' },
                        { from: 1, to: 40, name: 'Low', color: '#ef4444' },
                        { from: 41, to: 70, name: 'Medium', color: '#f97316' },
                        { from: 71, to: 100, name: 'Hige', color: '#16a34a' },
                    ],
                },
            },
        },
        dataLabels: {
            enabled: true,
            style: {
                colors: ['#fff']
            }
        },
        stroke: {
            width: 1,
        },
        xaxis: {
            title: {
                text: xAxisLabel,
                style: {
                    color: '#0070c0',
                    fontSize: '14px',
                    fontWeight: 600,
                    fontFamily: 'Inter, sans-serif',
                }
            },
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
            },
            categories: ['1', '2', '3'],
        },
        yaxis: {
            labels: {
                style: {
                    colors: '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
            },
            // reversed: true,
        },
    };

    return (
        <div className='bg-slate-100 pt-5 px-4 rounded-lg border w-full'>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="heatmap" height={height} width='100%' />
            </div>
            <div id="html-dist"></div>
        </div>
    )
}

export default HeatmapChart