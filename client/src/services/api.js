export async function sendMessageToApi(message) {
    const response = await fetch('http://localhost:5000/', {
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