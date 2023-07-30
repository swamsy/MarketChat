// OpenAI
export async function sendMessageToApi(message) {
    const response = await fetch('http://localhost:5000/openai/gpt-3.5-turbo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json() // wait for response from gpt-3.5
    return data
}

// Alpha Vantage
export async function getHistoricalData(symbol, timePeriod) {
  let interval;
  switch (timePeriod) {
    case '1D':
      interval = '5min';
      break;
    case '1W':
    case '1M':
      interval = '60min';
      break;
    default:
  }

  const response = await fetch(`http://localhost:5000/alphavantage/historical/${symbol}/${timePeriod}/${interval}`);
  const data = await response.json();
  return data;
}

export async function getCompanyOverview(symbol) {
  const response = await fetch(`http://localhost:5000/alphavantage/company-overview/${symbol}`);
  const data = await response.json();
  return data;
}

export async function searchSymbols(query) { // is some of this code better put here on the client side or in the finnhub.js route?
  const response = await fetch(`http://localhost:5000/alphavantage/search/${query}`);
  const data = await response.json();
  
  const bestMatches = data.bestMatches.filter(match => match['4. region'] === "United States"); // filter out non-US companies
  
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

// MongoDB
export async function saveChatMessage(role, content) {
  const response = await fetch('http://localhost:5000/chats/save-message', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role, content })
  });
  const data = await response.json();
  return data;
}