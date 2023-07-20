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
            let closeKey;
            switch (timePeriod) {
                case '1D':
                    timeSeriesKey = 'Time Series (5min)';
                    closeKey = '4. close';
                    break;
                case '1W':
                case '1M':
                    timeSeriesKey = 'Time Series (60min)';
                    closeKey = '4. close';
                    break;
                default:
                    timeSeriesKey = 'Time Series (Daily)';
                    closeKey = '5. adjusted close';
            }

            // Create an array of dates and closing prices
            // Note: each daily time series date is at 4PM EST although it's not specified in the response from the API 
            let datePricePairs = Object.keys(data[timeSeriesKey]).reverse().map(date => ({ date, price: data[timeSeriesKey][date][closeKey] })); // datePricePairs = [{date: '2021-05-28', price: '124.61'},...]

            // Filter data for the correct timeframe
            const endDate = new Date(datePricePairs[datePricePairs.length - 1].date);
            let startDate;
            switch (timePeriod) {
                case '1D':
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() - 1);
                    break;
                case '1W':
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case '1M':
                    startDate = new Date(endDate);
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                case '3M':
                    startDate = new Date(endDate);
                    startDate.setMonth(startDate.getMonth() - 3);
                    break;
                case 'YTD':
                    startDate = new Date(endDate);
                    startDate.setMonth(0);
                    startDate.setDate(1);
                    break;
                case '1Y':
                    startDate = new Date(endDate);
                    startDate.setFullYear(startDate.getFullYear() - 1);
                    break;
                default: // 5Y
                    startDate = new Date(endDate);
                    startDate.setFullYear(startDate.getFullYear() - 5);

                    // Filter data to show weekly adjusted close price
                    datePricePairs = datePricePairs.filter(pair => {
                        const [year, month, day] = pair.date.split('-');
                        const pairDate = new Date(year, month - 1, day);
                        return pairDate.getDay() === 5 || pairDate.toDateString() === endDate.toDateString();
                    });
            }

            // Filter the data to only include dates within the selected timeframe
            datePricePairs = datePricePairs.filter(pair => new Date(pair.date) >= startDate); // Only show data for selected time frame
            const dates = datePricePairs.map(pair => pair.date);
            const prices = datePricePairs.map(pair => pair.price);

            // Data that changes when symbol or time period changes
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
                        return formatDate(date, timePeriod);
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
    };
    const formattedHoveredChange = formatChange(hoveredChange);
    const formattedPercentChange = formatChange(hoveredPercentChange);
    
    const currentPriceIndex = chartData?.datasets[0].data.length - 1;
    const currentPrice = Number(chartData?.datasets[0].data[currentPriceIndex]);
    const initialPrice = Number(chartData?.datasets[0].data[0]);
    const change = currentPrice - initialPrice;
    const percentChange = (change / currentPrice) * 100;

  return (
    <div className="StockGraph" style={{paddingLeft: '50px'}}>
        <h1>{name}</h1>
        <h2>${hoveredPrice}</h2>
        <h2 style={{ color: formattedHoveredChange.color }}>
            {formattedHoveredChange.value} ({formattedPercentChange.value}%) {timePeriod}
        </h2>
        <div 
            className="StockGraph-chart" 
            style={{height: '400px', width: '1200px'}}
            onMouseLeave={() => {
                console.log(currentPrice);
                setHoveredPrice(currentPrice.toFixed(2));
                setHoveredChange(change.toFixed(2));
                setHoveredPercentChange(percentChange.toFixed(2));
              }}
        >
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