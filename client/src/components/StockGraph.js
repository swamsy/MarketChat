import { useEffect, useState } from 'react';
import styled from 'styled-components';
import StockGraphPlaceholder from '../assets/StockGraphPlaceholder.svg';
import { Line } from 'react-chartjs-2';
import { getHistoricalData, getCompanyLogo } from '../services/api';
import { Chart, CategoryScale, LineElement, PointElement, LinearScale } from 'chart.js';
import { CrosshairPlugin } from 'chartjs-plugin-crosshair';
import { calculateChange, calculatePercentChange, formatPriceChange, formatPercentChange, formatDate, formatDateRange, formatNumberWithCommas } from '../utilities/helperFunctions';
Chart.register(CategoryScale, LineElement, PointElement, LinearScale, CrosshairPlugin);

function StockGraph({ symbol, companyName }) {
    const [companyLogo, setCompanyLogo] = useState(null);
    const [isLogoLoading, setIsLogoLoading] = useState(true);
    const [chartData, setChartData] = useState(null);
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [hasData, setHasData] = useState(false);
    const [hoveredPrice, setHoveredPrice] = useState(null);
    const [hoveredChange, setHoveredChange] = useState(null);
    const [hoveredPercentChange, setHoveredPercentChange] = useState(null);
    const [hoveredDate, setHoveredDate] = useState(null);
    const [timePeriod, setTimePeriod] = useState('1D');
    const timePeriods = ["1D", "1W", "1M", "3M", "YTD", "1Y", "5Y"];

    const [currentPrice, setCurrentPrice] = useState(null);
    const [initialPrice, setInitialPrice] = useState(null);
    const [change, setChange] = useState(null);
    const [percentChange, setPercentChange] = useState(null);

    useEffect(() => {
        setIsLogoLoading(true);
        getCompanyLogo(symbol).then(logo => {
            setCompanyLogo(logo);
            setIsLogoLoading(false);
        })
            .catch(err => {
                console.error(err);
                setIsLogoLoading(false);
            });
    }, [symbol]);

    useEffect(() => {
        setIsDataLoading(true);
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

            if (datePricePairs.length === 0) { // no data available for selected timeframe '{}'
                setHasData(false);
                setIsDataLoading(false);
                return;
            }
            setHasData(true);

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

            setIsDataLoading(false);

        })
            .catch(err => {
                console.error(err);
                setHasData(false);
                setIsDataLoading(false);
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
        <StockGraphContainer>
            <NameandLogo>
                {isLogoLoading ? (
                    <DataPlaceholder width='38px' height='38px' />
                ) : (
                    companyLogo ? (
                        <StyledLogo src={companyLogo} alt={`${companyName} logo`} />
                    ) : (
                        <PlaceholderLogo>
                            <PlaceholderLogoText>{symbol}</PlaceholderLogoText>
                        </PlaceholderLogo>
                    )
                )}
                <h3>{companyName}</h3>
            </NameandLogo>
            <h2 style={{ margin: '0.33rem 0' }}>{isDataLoading ? <DataPlaceholder width='130px' height='42px' /> : hasData ? `$${formatNumberWithCommas(hoveredPrice)}` : '$--.--'}</h2>
            <Change color={hasData ? formatPriceChange(hoveredChange).color : 600}>
                {isDataLoading ? <DataPlaceholder width='180px' height='28px' /> : hasData ? `${formatNumberWithCommas(formatPriceChange(hoveredChange).value)} (${formatNumberWithCommas(formatPercentChange(hoveredPercentChange).value)})` : '$--.-- (--.--%)'}
            </Change>
            {isDataLoading ? <DataPlaceholder width='170px' height='24px' /> : hasData ? <p>{hoveredDate}</p> : <p>-- / -- / ----</p>}
            <StockGraphChart
                onMouseLeave={() => {
                    if (!hasData) return;
                    setHoveredPrice(currentPrice.toFixed(2));
                    setHoveredChange(change.toFixed(2));
                    setHoveredPercentChange(percentChange.toFixed(2));
                    setHoveredDate(formatDateRange(chartData.labels[0], chartData.labels[chartData.labels.length - 1], timePeriod));
                }}
            >
                {isDataLoading ? (
                    <StyledStockGraphPlaceholder src={StockGraphPlaceholder} alt="Stock Graph Placeholder" />
                ) : hasData ? (
                    <Line data={chartData} options={options} />
                ) : (
                    <p style={{ textAlign: 'center', paddingTop: '180px' }}>No data available</p>
                )}
            </StockGraphChart>
            <TimePeriodsContainer>
                {timePeriods.map(period => (
                    <TimePeriod
                        key={period}
                        onClick={() => setTimePeriod(period)}
                        $isActive={period === timePeriod} // transient prop
                    >
                        {period}
                    </TimePeriod>
                ))}
            </TimePeriodsContainer>
        </StockGraphContainer>
    );
}

const StockGraphContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
    padding: 1rem;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    flex: 1;
    
    p {
        margin: 0.2rem 0; 
        font-size: 14px;
        color: ${props => props.theme.colors[500]};
    }
`;

const NameandLogo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const StyledLogo = styled.img`
    height: 38px;
    width: 38px;
    object-fit: contain;
    border-radius: 4px;
`;

const PlaceholderLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors[400]};
  width: 38px;
  height: 38px;
  border-radius: 4px;
`;

const PlaceholderLogoText = styled.div`
  color: ${props => props.theme.colors[100]};
  text-align: center;
  font-size: 8px;
`;

const DataPlaceholder = styled.div`
    width: ${props => props.width};
    height: ${props => props.height};
    background-color: #cdcdcd;
    border-radius: 4px;
    margin-bottom: 0.2rem;
    animation: pulse 1.5s infinite ease-in-out;

    @keyframes pulse {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
    }
`;

const Change = styled.h4`
    color: ${props => props.theme.colors[props.color]};
`;

const StockGraphChart = styled.div`
    flex: 1;
    width: 100%;
    border-top: 1px solid ${props => props.theme.colors[100]};
    border-bottom: 1px solid ${props => props.theme.colors[100]};
    padding: 0.3rem 0;

    img {
        object-fit: cover;
        height: 100%;
        width: 100%;
    }
`;

const StyledStockGraphPlaceholder = styled.img`
    animation: pulse 1.5s infinite ease-in-out;

    @keyframes pulse {
        0% { opacity: 0.5; }
        50% { opacity: 1; }
        100% { opacity: 0.5; }
    }
`;

const TimePeriodsContainer = styled.div`
    display: flex;
    margin-top: 1rem;
`;

const TimePeriod = styled.div`
    background-color: ${props => props.$isActive ? props.theme.colors[100] : 'inherit'};
    color: ${props => props.theme.colors[700]};
    margin-right: 0.5rem;
    border: 1px solid ${props => props.theme.colors[700]};
    border-radius: 10px;
    padding: 0.5rem;

    &:hover {
        background-color: ${props => props.theme.colors[50]};
        cursor: pointer;
    }
`;


export default StockGraph;
