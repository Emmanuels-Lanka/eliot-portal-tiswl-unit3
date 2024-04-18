import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const HeatmapChart = () => {
    const series = [
        { name: 'Jan', data: [10, 20, 30] },
        { name: 'Feb', data: [20, 30, 40] },
        { name: 'Mar', data: [30, 40, 50] },
        { name: 'Apr', data: [40, 50, 60] },
        { name: 'May', data: [50, 60, 70] },
        { name: 'Jun', data: [60, 70, 80] },
        { name: 'Jul', data: [70, 80, 90] },
        { name: 'Aug', data: [80, 90, 100] },
        { name: 'Sep', data: [90, 100, 110] }
    ];

    const options = {
        chart: {
            // height: 350,
            type: 'heatmap' as const,
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                radius: 20,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        { from: 10, to: 50, name: 'low', color: '#00A100' },
                        { from: 51, to: 100, name: 'medium', color: '#128FD9' },
                        { from: 101, to: 150, name: 'high', color: '#FFB200' },
                        { from: 151, to: 200, name: 'extreme', color: '#FF0000' },
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
        title: {
            text: 'HeatMap Chart with Color Range',
            style: {
                color: '#ff0000',
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif',
            }
        },
        xaxis: {
            title: {
                text: 'Y Axis Label',
                style: {
                    color: '#ff0000',
                    fontSize: '14px',
                    fontWeight: 700,
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
            categories: ['1', '2', '3', '4'],
        },
        yaxis: {
            title: {
                text: 'Y Axis Label',
                style: {
                    color: '#ff0000',
                    fontSize: '14px',
                    fontWeight: 700,
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
            // reversed: true,
        },
    };

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="heatmap" height={450} width={800} />
            </div>
            <div id="html-dist"></div>
        </div>
    )
}

export default HeatmapChart