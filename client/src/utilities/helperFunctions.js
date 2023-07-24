import moment from 'moment-timezone';

export function formatLargeNum(value) {
    // Convert value to a number
    let num = Number(value);

    // Trillions
    if (num >= 1_000_000_000_000) {
        return (num / 1_000_000_000_000).toFixed(2) + 'T';
    } 
    // Billions
    else if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(2) + 'B';
    } 
    // Millions
    else if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(2) + 'M';
    } 
    // Thousands
    else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }

    return num.toString();
}

export function capitalizeWords(str) {
    // Capitalize the first letter of each word
    return str.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

export function formatDate(dateString, timePeriod) {
    let date = moment.tz(dateString, 'America/New_York');
    switch(timePeriod) {
        case '1D':
        case '1W':
        case '1M':
            return date.format('MMM D, h:mm A');
        default:
            return date.format('MMM D, YYYY');
    }
}

export function formatDateRange(startDate, endDate, timePeriod) {
    let sdate = moment.tz(startDate, 'America/New_York');
    let edate = moment.tz(endDate, 'America/New_York');
    switch(timePeriod) {
        case '1D':
            return `${sdate.format('MMM D, h:mm A')} - ${edate.format('h:mm A')}`;
        case '1W':
        case '1M':
            return `${sdate.format('MMM D, h:mm A')} - ${edate.format('MMM D, h:mm A')}`;
        default:
            return `${sdate.format('MMM D, YYYY')} - ${edate.format('MMM D, YYYY')}`;
    }
}

export function formatChange(change) {
    if (change >= 0) {
        return { value: `+${change}`, color: 'green' };
    } else {
        return { value: `${change}`, color: 'red' };
    }
}

export function calculateChange(initialPrice, currentPrice) {
    const change = currentPrice - initialPrice;
    return change;
}

export function calculatePercentChange(change, initialPrice) {
    const percentChange = (change / initialPrice) * 100;
    return percentChange;
}