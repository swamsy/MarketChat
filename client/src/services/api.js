// OpenAI
export async function sendMessagetoApi(message, symbol) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/openai/gpt-3.5-turbo/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, symbol })
  });

  if (!response.ok) {
    console.error(`Error sending chat message to api: ${response.statusText}`);
  }
}

export async function createMessageStream() {
  // Create an EventSource that connects to server endpoint
  console.log("create new event source")
  const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/openai/gpt-3.5-turbo/stream`); 
  
  eventSource.onerror = (error) => {
    console.error("EventSource failed:", error);
    eventSource.close();
  };
  
  return eventSource;
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

  const response = await fetch(`${process.env.REACT_APP_API_URL}/alphavantage/historical/${symbol}/${timePeriod}/${interval}`);
  const data = await response.json();
  return data;
}

export async function getCompanyOverview(symbol) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/alphavantage/company-overview/${symbol}`);
  const data = await response.json();
  return data;
}

// MongoDB
export async function searchSymbols(query) {
  //console.log("Search Symbols api.js", query);
  const response = await fetch(`${process.env.REACT_APP_API_URL}/results/search?query=${query}`);
  //console.log("Response:", response)
  const data = await response.json();
  //console.log("Data:", data)
  return data;
}

export async function getCompanyLogo(symbol) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/results/logo/${symbol}`);
  const data = await response.json();
  return data;
}

export async function saveChatMessage(role, content) {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/chats/save-message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ role, content })
  });
 
  if (!response.ok) {
    console.error(`Error saving chat message: ${response.statusText}`);
  }
}