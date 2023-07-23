import { useState } from 'react'
import { sendMessageToApi } from '../services/api'

function Chatbot({ symbol }) {  
  const [ value, setValue ] = useState('');
  const [ messages, setMessages] = useState([
    {
      role: "Mark",
      content: "Hey there! I’m Mark, MarketChat’s AI chat bot. What’s up?"
    }
  ]);
  const [ isMarkTyping, setIsMarkTyping ] = useState(false);
  const suggestedQueries = ["What is MarketChat?", `Give me a financial analysis on ${symbol}`];

  const sendMessage = async (message) => {
    setMessages(messages => [...messages, {role: 'user', content: message}]);
    setIsMarkTyping(true);
    try {
      const data = await sendMessageToApi(message);
      setMessages(messages => [...messages, {role: 'Mark', content: data.choices[0].message.content}]);
      setValue('');   
    } catch (error) {
      console.error(error);
    }
    setIsMarkTyping(false);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(value);
  }

  return (
    <div className="chatbot">
      <div className="chat-area">
        {messages.map((message, i) => (
          <div key={i} className={message.role}>
            <p>{message.role}: {message.content}</p>
          </div>
        ))}
        {isMarkTyping && <p>Mark is typing...</p>}
      </div>
      <div className="suggested-queries">
        {suggestedQueries.map((query, index) => (
          <button key={index} onClick={() => sendMessage(query)}>
            {query}
          </button>
        ))}
      </div>
      <form className="input-container" onSubmit={handleSubmit}> 
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit">Send</button> 
      </form>
    </div>
  )
}

export default Chatbot;
