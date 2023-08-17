import { useEffect, useState } from 'react';
import styled from 'styled-components';
import StockGraphPlaceholder from '../assets/StockGraphPlaceholder.svg';
import { Line } from 'react-chartjs-2';
import { getHistoricalData, getCompanyLogo } from '../services/api';
import { Chart, CategoryScale, LineElement, PointElement, LinearScale } from 'chart.js';
import { calculateChange, calculatePercentChange, formatPriceChange, formatPercentChange, formatDate, formatDateRange, formatNumberWithCommas } from '../utilities/helperFunctions';
Chart.register(CategoryScale, LineElement, PointElement, LinearScale);

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

    // hoverCrosshair plugin block
    let crosshair;
    const hoverCrosshair = {
        id: 'hoverCrosshair',
        events: ['mousemove', 'touchmove', 'touchend'],

        beforeDatasetsDraw(chart) {
            if(crosshair) {
                const { ctx } = chart;
                ctx.save();

                crosshair.forEach((line) => {
                    ctx.beginPath();
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = '#5c95d4';
                    ctx.moveTo(line.startX, line.startY);
                    ctx.lineTo(line.endX, line.endY);
                    ctx.stroke();
                })
                ctx.restore();
            }
        },


        afterEvent(chart, args) {
            const { chartArea: {top, bottom}, scales } = chart;

            if((!args.inChartArea || args.event.type === 'touchend') && crosshair) {
                crosshair = null;
                args.changed = true;
            } else if (args.inChartArea) {

                const elementsAtEvent = chart.getElementsAtEventForMode(args.event, 'index', { intersect: false }, true);
                const index = elementsAtEvent[0]?.index;

                if (index !== undefined) {
                    // Use the x-coordinate of the data point for the crosshair
                    const xCoor = scales.x.getPixelForValue(index);

                    crosshair = [ 
                        {
                            startX: xCoor,
                            startY: top,
                            endX: xCoor,
                            endY: bottom
                        }
                    ];
                    args.changed = true;
                }
            }
        }
    }

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

    const handleGraphExit = () => {
        if (!hasData) return;
        setHoveredPrice(currentPrice.toFixed(2));
        setHoveredChange(change.toFixed(2));
        setHoveredPercentChange(percentChange.toFixed(2));
        setHoveredDate(formatDateRange(chartData.labels[0], chartData.labels[chartData.labels.length - 1], timePeriod));
    }

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
            {isDataLoading ? <DataPlaceholder width='170px' height='24px' /> : hasData ? <StyledDateRange>{hoveredDate}</StyledDateRange> : <StyledDateRange>-- / -- / ----</StyledDateRange>}
            <StockGraphChart 
                onMouseLeave={() => handleGraphExit()}
                onTouchEnd={() => handleGraphExit()}
            >
                {isDataLoading ? (
                    <StyledStockGraphPlaceholder src={StockGraphPlaceholder} alt="Stock Graph Placeholder" />
                ) : hasData ? (
                    <Line data={chartData} options={options} plugins={[hoverCrosshair]} />
                ) : (
                    <p>No data available</p>
                )}
            </StockGraphChart>
            <TimePeriodsContainer>
                {timePeriods.map(period => (
                    <TimePeriod
                        key={period}
                        onClick={() => setTimePeriod(period)}
                        $isActive={period === timePeriod} // transient prop
                    >
                        <TimePeriodText>{period}</TimePeriodText>
                    </TimePeriod>
                ))}
            </TimePeriodsContainer>
        </StockGraphContainer>
    );
}

const StockGraphContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 1rem;
    //box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 15px;
    border-radius: 8px;
    height: 68vh;
`;

const NameandLogo = styled.div`
    display: flex;
    align-items: center;
    gap: 0.5rem;

    h3 {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

const StyledLogo = styled.img`
    height: 38px;
    width: 38px;
    object-fit: contain;
    border-radius: 4px;

    @media (max-width: 768px) {
        height: 32px;
        width: 32px;
    }
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

const StyledDateRange = styled.p`
    margin: 0.2rem 0; 
    font-size: 14px;
    color: ${props => props.theme.colors[500]};
`;

const StockGraphChart = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
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
    color: ${props => props.theme.colors[500]};
    margin-right: 0.5rem;
    border: 1px solid ${props => props.theme.colors[500]};
    border-radius: 10px;
    padding: 0.4rem 0.5rem;

    &:hover {
        background-color: ${props => props.theme.colors[50]};
        cursor: pointer;
    }

    @media (max-width: 768px) {
        margin-right: 0.4rem;
        padding: 0.25rem 0.4rem;
    }

    @media (max-width: 350px) {
        margin-right: 0.3rem;
        padding: 0.25rem 0.3rem;
    }
`;

const TimePeriodText = styled.p`
    color: ${props => props.theme.colors[500]};

    @media (max-width: 768px) {
        font-size: 14px;
    }
`;

export default StockGraph;
