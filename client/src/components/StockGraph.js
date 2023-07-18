import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getHistoricalData } from '../services/api';
import { Chart, CategoryScale, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';

Chart.register(CrosshairPlugin, LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);


function StockGraph({ symbol, name }) {
  const [chartData, setChartData] = useState(null);
  const [hoveredPrice, setHoveredPrice] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

    useEffect(() => {
        getHistoricalData(symbol).then(data => {
        // Create an array of dates and closing prices
        const dates = Object.keys(data['Time Series (Daily)']).reverse();
        const prices = dates.map(date => data['Time Series (Daily)'][date]['5. adjusted close']);

            setChartData({
                labels: dates,
                datasets: [{
                data: prices,
                fill: false,
                borderColor: 'blue',
                pointRadius: 0,
                pointHoverBackgroundColor: 'blue',
                }]
            });
        });
    }, [symbol]);

    const options = {
        animation: false,
        scales: {
            x: {
                display: false
            },
            y: {
                display: false
            }
        },
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                enabled: false
            },
            crosshair: {
                line: {
                    color: '#000000', 
                    width: 1
                },
                zoom: {
                    enabled: false
                },
                snap: {
                    enabled: true
                }
            }
        },
        onHover: (event, chartElement) => {
            if (chartElement[0]) {
              setHoveredDate(chartData.labels[chartElement[0].index]);
              setHoveredPrice(Number(chartData.datasets[0].data[chartElement[0].index]).toFixed(2));
            }
        }
    };
    

  return (
    <div className='StockGraph'>
        <h1>{name}</h1>
        <h2>{hoveredPrice}</h2>
        <h2>{hoveredDate}</h2>
        {chartData && <Line data={chartData} options={options} />}
    </div>
  );
}

export default StockGraph;
