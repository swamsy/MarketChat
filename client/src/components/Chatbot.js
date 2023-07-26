import { useState } from 'react'
import { sendMessageToApi } from '../services/api'
import styled from 'styled-components'

function Chatbot({ symbol }) {  
  const [ value, setValue ] = useState('');
  const [ messages, setMessages] = useState([
    {
      role: "Mark",
      content: "Hey there! I’m Mark, MarketChat’s AI chat bot. What’s up?"
    }
  ]);
  const [ isMarkTyping, setIsMarkTyping ] = useState(false);
  const suggestedQueries = ["What is MarketChat?", `Give me a financial analysis on ${symbol}`]; // ocassionally, the ai won't know the stock ticker, so feed it the company's name along with the ticker to minimize ai not knowing of the stock

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
    <ChatbotContainer>
      <ChatArea>
        {messages.map((message, i) => (
          <Message key={i} className={message.role}>
            <p>{message.role}: {message.content}</p>
          </Message>
        ))}
        {isMarkTyping && <p>Mark is typing...</p>}
      </ChatArea>
      <SendMessageSuggestedQueryContainer>
        {suggestedQueries.map((query, index) => (
          <SuggestedQuery key={index} onClick={() => sendMessage(query)}>
            {query}
          </SuggestedQuery>
        ))}
      <SendMessageContainer className="input-container" onSubmit={handleSubmit}> 
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        <button type="submit">Send</button> 
        </SendMessageContainer>
      </SendMessageSuggestedQueryContainer>
    </ChatbotContainer>
  )
}

const ChatbotContainer = styled.div`


`;

const ChatArea = styled.div`


`;

const Message = styled.div`


`;

const SendMessageSuggestedQueryContainer = styled.div`


`;

const SuggestedQuery = styled.div`


`;

const SendMessageContainer = styled.form`


`;


export default Chatbot;
