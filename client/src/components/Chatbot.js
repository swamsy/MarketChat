import { useState, useRef, useEffect } from 'react'
import { sendMessageToApi, saveChatMessage } from '../services/api'

import styled from 'styled-components'
import SendIcon from '../assets/SendIcon.svg';
//import UserIcon from '../assets/UserIcon.png';
import MarkIcon from '../assets/MarkIcon.png';

function Chatbot({ symbol }) {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([
    {
      role: "Mark",
      content: "Hey there! I’m Mark, MarketChat’s AI chat bot. What’s up?"
    }
  ]);
  const [isMarkTyping, setIsMarkTyping] = useState(false);
  const suggestedQueries = ["What is MarketChat?", `Give me a financial analysis on ${symbol}`]; // ocassionally, the ai won't know the stock ticker, so feed it the company's name along with the ticker to minimize ai not knowing of the stock
  const [clickedIndices, setClickedIndices] = useState([]);

  const chatEndRef = useRef(null);
  const [isInputFocused, setInputFocused] = useState(false);

  const sendMessage = async (message) => {
    setMessages(messages => [...messages, { role: 'user', content: message }]);
    setIsMarkTyping(true);
    saveChatMessage('user', message);

    try {
      const data = await sendMessageToApi(message);
      setMessages(messages => [...messages, { role: 'Mark', content: data.choices[0].message.content }]);

      saveChatMessage('Mark', data.choices[0].message.content);

      setValue('');
    } catch (err) {
      console.error(err);
    }
    setIsMarkTyping(false);
  }

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollTop = chatEndRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setClickedIndices(indices => indices.filter(index => index !== 1));
  }, [symbol]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim() === '') { // don't allow user to send empty message
      return;
    }
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
      <ChatbotHeader>
        <h4>Chat with Mark</h4>
      </ChatbotHeader>
      <ChatArea ref={chatEndRef}>
        {messages.map((message, i) => (
          <Message key={i} className={message.role}>
            {message.role === 'Mark' && <StyledMarkIcon src={MarkIcon} alt="Mark Icon" />}
            <MessageBubble className={message.role}>
              <p>{message.content}</p>
            </MessageBubble>
          </Message>
        ))}
        {isMarkTyping && <p>Mark is typing...</p>}
      </ChatArea>
      <SendMessageSuggestedQueryContainer>
        {suggestedQueries.map((query, index) => {
          if (clickedIndices.includes(index)) {
            return null;
          }
          return (
            <SuggestedQuery key={index} onClick={() => {
              sendMessage(query);
              setClickedIndices(indices => [...indices, index]);
            }}>
              {query}
            </SuggestedQuery>
          );
        })}
        <SendMessageContainer onSubmit={handleSubmit} $isInputFocused={isInputFocused}> {/* transient prop */}
          <textarea
            type="text"
            value={value} placeholder="Send a message..."
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            rows="1"
          />
          <SendCircle type="submit">
            <img src={SendIcon} alt="Send Icon" />
          </SendCircle>
        </SendMessageContainer>
      </SendMessageSuggestedQueryContainer>
    </ChatbotContainer>
  )
}

const ChatbotContainer = styled.div`
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  height: 68vh;
`;

const ChatbotHeader = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors[700]};
  border-radius: 8px 8px 0px 0px;

  h4 {
    color: ${props => props.theme.colors[50]};
    padding: 0.5rem;
    margin-left: 0.2rem;
  }
`;

const ChatArea = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
  padding: 0.875rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors[100]};
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors[200]};
  }
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  max-width: 80%;
  margin-bottom: 1.2rem;
  align-self: ${props => props.className === "user" ? 'flex-end' : 'flex-start'};

  p {
    color: ${props => props.className === "user" ? props.theme.colors[100] : props.theme.colors[950]};
  }
`;

const MessageBubble = styled.div`
  padding: 0.8rem;
  background-color: ${props => props.className === "user" ? props.theme.colors[500] : props.theme.colors[50]};
  border-radius: ${props => props.className === "user" ? '1.875rem 0rem 1.875rem 1.875rem' : '0rem 1.875rem 1.875rem 1.875rem'};
  white-space: pre-wrap;
`;

//const StyledUserIcon = styled.img`
//  height: 1.5rem;
//  margin-left: 0.7rem;
//  border-radius: 50px;
//  border: 4px solid ${props => props.theme.colors[50]};
//`;

const StyledMarkIcon = styled.img`
  height: 1.5rem;
  margin-right: 0.7rem;
  border-radius: 50px;
  border: 4px solid ${props => props.theme.colors[50]};

`;

const SendMessageSuggestedQueryContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.875rem;

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
  border: ${props => props.$isInputFocused ? `1px solid ${props.theme.colors[400]}` : `1px solid ${props.theme.colors[100]}`};  
  border-radius: 50px;

  textarea {
    background-color: transparent;
    flex: 1;
    padding: 0;
    padding-top: 6px;
    line-height: 1.5;
    border: none;
    outline: none;
    resize: none;
    font-size: 16px;
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
