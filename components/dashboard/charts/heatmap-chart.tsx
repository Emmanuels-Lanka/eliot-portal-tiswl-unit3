import React from 'react';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface HeatmapChartProps {
    xAxisLabel: string;
    height: number;
    type: string;
    efficiencyLow?: number;
    efficiencyHigh?: number;
    heatmapData: number[][];
    heatmapCategories: string[];
}

const HeatmapChart = ({
    xAxisLabel,
    height,
    type,
    efficiencyLow,
    efficiencyHigh,
    heatmapData,
    heatmapCategories
}: HeatmapChartProps) => {
    let series: { name: string; data: number[] }[] = [];

    if (type === '60min') {
        series = [
            { name: '7:00 - 7:59', data: heatmapData[0] },
            { name: '8:00 - 8:59', data: heatmapData[1] },
            { name: '9:00 - 9:59', data: heatmapData[2] },
            { name: '10:00 - 10:59', data: heatmapData[3] },
            { name: '11:00 - 11:59', data: heatmapData[4] },
            { name: '12:00 - 12:59', data: heatmapData[5] },
            { name: '13:00 - 13:59', data: heatmapData[6] },
            { name: '14:00 - 14:59', data: heatmapData[7] },
            { name: '15:00 - 15:59', data: heatmapData[8] },
            { name: '16:00 - 16:59', data: heatmapData[9] },
            { name: '17:00 - 17:59', data: heatmapData[10] },
            { name: '18:00 - 18:59', data: heatmapData[11] }
        ];
    } else if (type === '15min') {
        series = [
            { name: '7:00 - 7:14', data: heatmapData[0] },
            { name: '7:15 - 7:29', data: heatmapData[1] },
            { name: '7:30 - 7:44', data: heatmapData[2] },
            { name: '7:45 - 7:59', data: heatmapData[3] },
            { name: '8:00 - 8:14', data: heatmapData[4] },
            { name: '8:15 - 8:29', data: heatmapData[5] },
            { name: '8:30 - 8:44', data: heatmapData[6] },
            { name: '8:45 - 8:59', data: heatmapData[7] },
            { name: '9:00 - 9:14', data: heatmapData[8] },
            { name: '9:15 - 9:29', data: heatmapData[9] },
            { name: '9:30 - 9:44', data: heatmapData[10] },
            { name: '9:45 - 9:59', data: heatmapData[11] },
            { name: '10:00 - 10:14', data: heatmapData[12] },
            { name: '10:15 - 10:29', data: heatmapData[13] },
            { name: '10:30 - 10:44', data: heatmapData[14] },
            { name: '10:45 - 10:59', data: heatmapData[15] },
            { name: '11:00 - 11:14', data: heatmapData[16] },
            { name: '11:15 - 11:29', data: heatmapData[17] },
            { name: '11:30 - 11:44', data: heatmapData[18] },
            { name: '11:45 - 11:59', data: heatmapData[19] },
            { name: '12:00 - 12:14', data: heatmapData[20] },
            { name: '12:15 - 12:29', data: heatmapData[21] },
            { name: '12:30 - 12:44', data: heatmapData[22] },
            { name: '12:45 - 12:59', data: heatmapData[23] },
            { name: '13:00 - 13:14', data: heatmapData[24] },
            { name: '13:15 - 13:29', data: heatmapData[25] },
            { name: '13:30 - 13:44', data: heatmapData[26] },
            { name: '13:45 - 13:59', data: heatmapData[27] },
            { name: '14:00 - 14:14', data: heatmapData[28] },
            { name: '14:15 - 14:29', data: heatmapData[29] },
            { name: '14:30 - 14:44', data: heatmapData[30] },
            { name: '14:45 - 14:59', data: heatmapData[31] },
            { name: '15:00 - 15:14', data: heatmapData[32] },
            { name: '15:15 - 15:29', data: heatmapData[33] },
            { name: '15:30 - 15:44', data: heatmapData[34] },
            { name: '15:45 - 15:59', data: heatmapData[35] },
            { name: '16:00 - 16:14', data: heatmapData[36] },
            { name: '16:15 - 16:29', data: heatmapData[37] },
            { name: '16:30 - 16:44', data: heatmapData[38] },
            { name: '16:45 - 16:59', data: heatmapData[39] },
            { name: '17:00 - 17:14', data: heatmapData[40] },
            { name: '17:15 - 17:29', data: heatmapData[41] },
            { name: '17:30 - 17:44', data: heatmapData[42] },
            { name: '17:45 - 17:59', data: heatmapData[43] },
            { name: '18:00 - 18:14', data: heatmapData[44] },
            { name: '18:15 - 18:29', data: heatmapData[45] },
            { name: '18:30 - 18:44', data: heatmapData[46] },
            { name: '18:45 - 18:59', data: heatmapData[47] }
        ];        
    } else if (type === 'tls') {
        series = [
            { name: 'Round 1', data: heatmapData[0] },
            { name: 'Round 2', data: heatmapData[1] },
            { name: 'Round 3', data: heatmapData[2] },
            { name: 'Round 4', data: heatmapData[3] },
            { name: 'Round 5', data: heatmapData[4] },
            { name: 'Round 6', data: heatmapData[5] },
            { name: 'Round 7', data: heatmapData[6] },
            { name: 'Round 8', data: heatmapData[7] },
            { name: 'Round 9', data: heatmapData[8] },
            { name: 'Round 10', data: heatmapData[9] },
            { name: 'Round 11', data: heatmapData[10] },
            { name: 'Round 12', data: heatmapData[11] }
        ];
    }

    const options = {
        chart: {
            type: 'heatmap' as const,
        },
        plotOptions: {
            heatmap: {
                enableShades: false,
                radius: type === 'tls' ? 10 : 30,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        { 
                            from: 0, 
                            to: efficiencyLow || 44, 
                            name: type === 'tls' ? 'Red' : 'Low', 
                            color: '#ef4444' 
                        },
                        { 
                            from: efficiencyLow || 45, 
                            to: efficiencyHigh || 74, 
                            name: type === 'tls' ? 'Orange' :  'Medium', 
                            color: '#f97316' 
                        },
                        { 
                            from: efficiencyHigh || 75, 
                            to: 1000, 
                            name: type === 'tls' ? 'Green' :  'High', 
                            color: '#16a34a' 
                        },
                    ],
                },
            },
        },
        dataLabels: {
            enabled: type !== 'tls',
            style: {
                colors: ['#fff']
            }
        },
        stroke: {
            width: type === 'tls' ? 5 : 1,
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
                    colors: type === 'tls' ? '#334155' : '#0070c0',
                    fontSize: '12px',
                    fontFamily: 'Inter, sans-serif',
                },
            },
            categories: heatmapCategories,
        },
        yaxis: {
            labels: {
                style: {
                    colors: type === 'tls' ? '#334155' : '#0070c0',
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