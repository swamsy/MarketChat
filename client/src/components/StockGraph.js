import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { getHistoricalData } from '../services/api';
import { Chart, CategoryScale, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';
import { formatChange, formatDate } from '../utilities/helperFunctions';

Chart.register(CrosshairPlugin, LineController, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

Tooltip.positioners.topCrosshair = function(items) {
    const pos = Tooltip.positioners.average(items);
  
    // Happens when nothing is found
    if (pos === false) {
      return false;
    }
  
    const chart = this.chart;
  
    return {
      x: pos.x,
      y: chart.scales.y.paddingTop,
      xAlign: 'center',
      yAlign: 'bottom',
    };
  };

function StockGraph({ symbol, name }) {
  const [chartData, setChartData] = useState(null);
  const [hoveredPrice, setHoveredPrice] = useState(null);
  const [hoveredChange, setHoveredChange] = useState(null);
  const [hoveredPercentChange, setHoveredPercentChange] = useState(null);
  const [timePeriod, setTimePeriod] = useState('1D');
  const timePeriods = ["1D", "1W", "1M", "3M", "YTD", "1Y", "5Y"];

    useEffect(() => {
        getHistoricalData(symbol, timePeriod).then(data => {
            let timeSeriesKey;
            switch (timePeriod) {
                case '1D':
                    timeSeriesKey = 'Time Series (5min)';
                    break;
                case '1W':
                case '1M':
                    timeSeriesKey = 'Time Series (60min)';
                    break;
                default:
                    timeSeriesKey = 'Time Series (Daily)';
            }

            // Create an array of dates and closing prices
            const dates = Object.keys(data['Time Series (Daily)']).reverse();
            const prices = dates.map(date => data['Time Series (Daily)'][date]['5. adjusted close']);
            
            // Data that changes when symbol changes
            setChartData({ 
                labels: dates,
                datasets: [{
                data: prices,
                }]
            });
        });
    }, [symbol, timePeriod]);

    // Options that don't change when symbol changes
    const options = {
        maintainAspectRatio: false,
        borderColor: 'blue',
        pointRadius: 0,
        pointHoverBackgroundColor: 'blue',
        animation: false,
        layout: {
            padding: {
                top: 22
            }
        },
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
                enabled: true, 
                position: 'topCrosshair',  // Use custom positioner
                backgroundColor: 'transparent',
                titleColor: 'black',
                callbacks: {
                    title: (context) => {
                        const date = context[0].label;
                        return formatDate(date);
                    },
                    label: () => '',
                }
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
                const price = Number(chartData.datasets[0].data[chartElement[0].index]);
                setHoveredPrice(price.toFixed(2));

                // Calculate change and percentage change
                const initialPrice = Number(chartData.datasets[0].data[0]);
                const change = price - initialPrice;
                const percentChange = (change / initialPrice) * 100;

                // Store change and percentage change in state
                setHoveredChange(change.toFixed(2));
                setHoveredPercentChange(percentChange.toFixed(2));

            }
        },
        onLeave: () => {
            setHoveredPrice(Number(chartData.datasets[0].data[0]).toFixed(2));
        }
        
    };
    const formattedHoveredChange = formatChange(hoveredChange);
    const formattedPercentChange = formatChange(hoveredPercentChange);
    

  return (
    <div className="StockGraph">
        <h1>{name}</h1>
        <h2>${hoveredPrice}</h2>
        <h2 style={{ color: formattedHoveredChange.color }}>
            {formattedHoveredChange.value} ({formattedPercentChange.value}%)
        </h2>
        <div className="StockGraph-chart" style={{height: '320px', width: '1100px'}}>
            {chartData && <Line data={chartData} options={options} />}
        </div>
        <div className="time-periods">
            {timePeriods.map(period => (
                <button key={period} onClick={() => setTimePeriod(period)}>
                    {period}
                </button>
            ))}
        </div>
    </div>
  );
}

export default StockGraph;
