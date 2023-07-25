import { useEffect, useState } from 'react';
import styled from 'styled-components';
import StockGraphPlaceholder from '../assets/StockGraphPlaceholder.svg';
import { Line } from 'react-chartjs-2';
import { getHistoricalData } from '../services/api';
import { Chart, CategoryScale, LineElement, PointElement, LinearScale } from 'chart.js';
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';
import { calculateChange, calculatePercentChange, formatChange, formatDate, formatDateRange } from '../utilities/helperFunctions';  
Chart.register(CategoryScale, LineElement, PointElement, LinearScale, CrosshairPlugin);



function StockGraph({ symbol, companyName }) {
    const [chartData, setChartData] = useState(null);
    const [hasData, setHasData] = useState(true);
    const [hoveredPrice, setHoveredPrice] = useState(null);
    const [hoveredChange, setHoveredChange] = useState(null);
    const [hoveredPercentChange, setHoveredPercentChange] = useState(null);
    const [hoveredDate, setHoveredDate] = useState(null);
    const [timePeriod, setTimePeriod] = useState('1D');
    const timePeriods = ["1D", "1W", "1M", "3M", "YTD", "1Y", "5Y"];
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentPrice, setCurrentPrice] = useState(null);
    const [initialPrice, setInitialPrice] = useState(null);
    const [change, setChange] = useState(null);
    const [percentChange, setPercentChange] = useState(null);

    useEffect(() => {
        setIsLoading(true);
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
            const endDate = new Date();
            let startDate;
            switch (timePeriod) {
                case '1D':
                    startDate = new Date(datePricePairs[datePricePairs.length - 1].date);
                    startDate.setHours(9, 30, 0, 0);
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
            console.log(datePricePairs);
            if (datePricePairs.length === 0) { // no data available
                setHasData(false);
                setIsLoading(false);
                return;
              } else {
                setHasData(true);

              }
            const dates = datePricePairs.map(pair => pair.date);
            const prices = datePricePairs.map(pair => pair.price);

            setChartData({ 
                labels: dates,
                datasets: [{
                data: prices,
                }]
            });

            const currentPriceValue = Number(prices[prices.length - 1]);
            const initialPriceValue = Number(prices[0]);
            const changeValue = calculateChange(initialPriceValue, currentPriceValue);
            const percentChangeValue = calculatePercentChange(changeValue, initialPriceValue);

            setHoveredPrice(currentPriceValue.toFixed(2));
            setHoveredChange(changeValue.toFixed(2));
            setHoveredPercentChange(percentChangeValue.toFixed(2));
            setHoveredDate(formatDateRange(dates[0], dates[dates.length - 1], timePeriod));

            setCurrentPrice(currentPriceValue);
            setInitialPrice(initialPriceValue);
            setChange(changeValue);
            setPercentChange(percentChangeValue);

            setIsLoading(false)
        })
        .catch(err => {
            console.error(err);
            setHasData(false);
            setIsLoading(false);
        });
    }, [symbol, timePeriod]);

    // Chart appearance options
    const options = {
        maintainAspectRatio: false,
        borderColor: '#14243d',
        pointRadius: 0,
        pointHoverBackgroundColor: '#14243d',
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
                    color: '#14243d', 
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
                const change = calculateChange(initialPrice, price);
                const percentChange = calculatePercentChange(change, initialPrice);
    
                // Store change and percentage change in state
                setHoveredChange(change.toFixed(2));
                setHoveredPercentChange(percentChange.toFixed(2));
                setHoveredDate(formatDate(chartData.labels[chartElement[0].index], timePeriod));
            }
        },
    };

  return (
    <div className='StockGraph'>
        <h2>{companyName}</h2>
        <h2>${hoveredPrice}</h2>
        <h2 style={{ color: formatChange(hoveredChange).color }}>
            {formatChange(hoveredChange).value} ({formatChange(hoveredPercentChange).value}%) {timePeriod}
        </h2>
        <p>{hoveredDate}</p>
        <div 
            className="StockGraph-chart" 
            style={{height: '40vh', width: '60vw'}}
            onMouseLeave={() => {
                setHoveredPrice(currentPrice.toFixed(2));
                setHoveredChange(change.toFixed(2));
                setHoveredPercentChange(percentChange.toFixed(2));
                setHoveredDate(formatDateRange(chartData.labels[0], chartData.labels[chartData.labels.length - 1], timePeriod));
              }}
        >
            {isLoading ? (
                <img src={StockGraphPlaceholder} alt="Stock Graph Placeholder"/>
            ) : hasData ? (
                chartData && <Line data={chartData} options={options} />
            ) : (
                <p style={{textAlign: 'center', paddingTop: '180px'}}>No data available</p>
            )}
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
