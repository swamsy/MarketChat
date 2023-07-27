import { useState } from 'react'
import { sendMessageToApi } from '../services/api'

import styled from 'styled-components'
import SendIcon from '../assets/SendIcon.svg';
import UserIcon from '../assets/UserIcon.png';
import MarkIcon from '../assets/MarkIcon.png';

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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <ChatbotContainer>
      <ChatArea>
        {messages.map((message, i) => (
          <Message key={i} className={message.role}>
            {message.role === 'Mark' && <StyledMarkIcon src={MarkIcon} alt="Mark Icon"/>}
            <MessageBubble className={message.role}>
              <p>{message.content}</p>
            </MessageBubble>
            {message.role === 'user' && <StyledUserIcon src={UserIcon} alt="User Icon"/>}
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
          <textarea 
            type="text" 
            value={value} placeholder="Send a message..." 
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown} 
          />
          <SendCircle type="submit">
            <img src={SendIcon} alt="Send Logo"/>
          </SendCircle> 
        </SendMessageContainer>
      </SendMessageSuggestedQueryContainer>
    </ChatbotContainer>
  )
}

const ChatbotContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.875rem;
  border: 1px solid ${props => props.theme.colors[100]};
  border-radius: 10px;
  flex: 1;
`;

const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  max-width: 75%;
  margin-bottom: 1.2rem;
  align-self: ${props => props.className === "user" ? 'flex-end' : 'flex-start'};

  p {
    color: ${props => props.className === "user" ? props.theme.colors[100] : props.theme.colors[950]};
  }
`;

const MessageBubble = styled.div`
  padding: 0.8rem;
  background-color: ${props => props.className === "user" ? props.theme.colors[700] : props.theme.colors[50]};
  border-radius: ${props => props.className === "user" ? '1.875rem 0rem 1.875rem 1.875rem' : '0rem 1.875rem 1.875rem 1.875rem'};
`;

const StyledUserIcon = styled.img`
  height: 1.5rem;
  margin-left: 0.7rem;
  border-radius: 50px;
  border: 4px solid ${props => props.theme.colors[50]};
`;

const StyledMarkIcon = styled.img`
  height: 1.5rem;
  margin-right: 0.7rem;
  border-radius: 50px;
  border: 4px solid ${props => props.theme.colors[50]};

`;

const SendMessageSuggestedQueryContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #ccc;

`;

const SuggestedQuery = styled.div`
  color: ${props => props.theme.colors[700]};
  border: 1px solid ${props => props.theme.colors[700]};
  border-radius: 15px;
  padding: 0.4rem;
  margin-bottom: 0.6rem;
  align-self: flex-end;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors[50]};
  }

  &:active {
    background-color: ${props => props.theme.colors[100]};
  }
`;

const SendMessageContainer = styled.form`
  display: flex;
  padding: 0.375em 0.375rem 0.375rem 0.8rem;
  border: 1px solid ${props => props.theme.colors[100]};
  border-radius: 50px;
  white-space: pre-wrap;
  max-height: 100px;
  overflow-y: auto;

  textarea {
    flex: 1;
    border: none;
    outline: none;
    resize: none;
    overflow-y: auto;
  }
`;

const SendCircle = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors[500]};
  padding: 0.6rem;
  border: none;
  border-radius: 5rem;

  &:hover {
    cursor: pointer;
    background-color: ${props => props.theme.colors[600]};
  }

  &:active {
    background-color: ${props => props.theme.colors[700]};
  }

`;

export default Chatbot;
