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