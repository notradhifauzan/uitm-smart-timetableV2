import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import Chart from 'chart.js/auto'

export const LineChart = ({ chartData,maxScore }) => {
    const [data, setData] = useState({
        labels: Array.from({ length: chartData.length }, (_, i) => i),
        datasets: [
            {
                label: "Convergence Result",
                data: chartData,
            },
        ],
    });


    const options = {
        scales: {
            y: {
                suggestedMax: maxScore, // Set the maximum value for the y-axis
            },
        },
    };

    return (
        <div className='bg-light mt-4'>
            <Line data={data}
                  height={300} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            suggestedMax: maxScore, // Set the maximum value for the y-axis
                        },
                    }, 
                  }} />
        </div>
    )
}
