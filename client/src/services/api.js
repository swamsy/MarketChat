// OpenAI
export async function sendMessageToApi(message) {
    const response = await fetch('http://localhost:5000/openai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message
      })
    })
    const data = await response.json()
    return data
}

// Alpha Vantage
export async function getHistoricalData(symbol) {
  const response = await fetch(`http://localhost:5000/alphavantage/historical/${symbol}`);
  const data = await response.json();
  return data;
}

export async function getCompanyOverview(symbol) {
  const response = await fetch(`http://localhost:5000/alphavantage/company-overview/${symbol}`);
  const data = await response.json();
  return data;
}

export async function searchSymbols(query) {
  const response = await fetch(`http://localhost:5000/alphavantage/search/${query}`);
  const data = await response.json();
  
  const bestMatches = data.bestMatches.filter(match => !match['1. symbol'].includes('.'));
  
  // Fetch the company logos concurrently
  const logos = await Promise.all(bestMatches.map(match => getCompanyLogo(match['1. symbol'])));

  // Add logo to each match
  for (let i = 0; i < bestMatches.length; i++) {
    bestMatches[i].logo = logos[i];
  }

  return bestMatches;
}

// Finnhub
export async function getCompanyLogo(symbol) {
  const response = await fetch(`http://localhost:5000/finnhub/company-profile/${symbol}`);
  const data = await response.json();
  return data.logo;
}