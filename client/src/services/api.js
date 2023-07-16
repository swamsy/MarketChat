export async function sendMessageToApi(message) {
    const response = await fetch('http://localhost:5000/chatbot', {
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

export async function getCompanyOverview(symbol) {
  const response = await fetch(`http://localhost:5000/alphavantage/company-overview/${symbol}`);
  const data = await response.json();
  return data;
}

export async function searchSymbols(query) {
  const response = await fetch(`http://localhost:5000/alphavantage/search/${query}`);
  const data = await response.json();
  return data.bestMatches;
}
