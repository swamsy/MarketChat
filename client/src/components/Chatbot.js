import { useState, useRef, useEffect } from 'react'
import { sendMessageToApi, saveChatMessage } from '../services/api'

import styled from 'styled-components'
import SendIcon from '../assets/SendIcon.svg';
import MarkIcon from '../assets/MarkIcon.png';
import { CustomPulseLoader } from './Loaders';

function Chatbot({ symbol }) {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([
    {
      role: "Mark",
      content: "Hey there! I’m Mark, MarketChat’s AI chat bot. What’s up?"
    }
  ]);
  const [isMarkTyping, setIsMarkTyping] = useState(false);
  const suggestedQueries = ["What is MarketChat?", `What is the current market sentiment on ${symbol}?`, `Give me a financial analysis on ${symbol}`]; // ocassionally, the ai won't know the stock ticker, so feed it the company's name along with the ticker to minimize ai not knowing of the stock
  const [clickedIndices, setClickedIndices] = useState([]);

  const chatEndRef = useRef(null);
  const textAreaRef = useRef(null);
  const [isInputFocused, setInputFocused] = useState(false);

  const sendMessage = async (message) => {
    try {
      setMessages(messages => [...messages, { role: 'user', content: message }]);
      setIsMarkTyping(true);
      saveChatMessage('user', message);

      const data = await sendMessageToApi(message, symbol);
      setMessages(messages => [...messages, { role: 'Mark', content: data.choices[0].message.content }]);
      saveChatMessage('Mark', data.choices[0].message.content);
      console.log("Prompt Tokens:", data.usage.prompt_tokens);
      console.log("Completion Tokens:", data.usage.completion_tokens);      
      console.log("Total Tokens:", data.usage.total_tokens);

      setIsMarkTyping(false);
    } catch (err) {
      console.error(err);
      setIsMarkTyping(false);
    }
  }

  useEffect(() => { // scroll to bottom of chat when new message is added
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
    setValue(''); // Empty input field
    textAreaRef.current.style.height = 'auto'; // Reset textarea height
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextAreaChange = (e) => {
    setValue(e.target.value);
    textAreaRef.current.style.height = 'auto';  // Reset textarea height
    textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
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
      <MarkTyping>
        {isMarkTyping && <h6>Mark is typing</h6>}
        {isMarkTyping && <CustomPulseLoader />}
      </MarkTyping>
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
              <p>{query}</p>
            </SuggestedQuery>
          );
        })}
        <SendMessageContainer onSubmit={handleSubmit} $isInputFocused={isInputFocused}> {/* transient prop */}
          <StyledTextArea
            ref={textAreaRef}
            type="text"
            value={value} 
            placeholder="Send a message..."
            onChange={handleTextAreaChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            rows="1"
          />
          <SendBox type="submit">
            <img src={SendIcon} alt="Send Icon" />
          </SendBox>
        </SendMessageContainer>
      </SendMessageSuggestedQueryContainer>
    </ChatbotContainer>
  )
}

const ChatbotContainer = styled.div`
  display: flex;
  flex-direction: column;
  //box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.25);
  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 15px;
  border-radius: 8px;
  height: 68vh;
`;

const ChatbotHeader = styled.div`
  display: flex;
  background-color: ${props => props.theme.colors[500]};
  border-radius: 8px 8px 0px 0px;
  box-shadow: rgba(57, 57, 57, 0.26) 0px 2px 15px 0px;

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
  border-radius: ${props => props.className === "user" ? '1rem 0rem 1rem 1rem' : '0rem 1rem 1rem 1rem'};
  white-space: pre-wrap;
`;

const StyledMarkIcon = styled.img`
  height: 32px;
  margin-right: 0.7rem;
  border-radius: 50px;
  border: 4px solid ${props => props.theme.colors[50]};

`;

const MarkTyping = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SendMessageSuggestedQueryContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.875rem;
  padding-top: 0.3rem;

`;

const SuggestedQuery = styled.div`
  color: ${props => props.theme.colors[500]};
  border: 1px solid ${props => props.theme.colors[500]};
  border-radius: 15px;
  padding: 0.2rem 0.5rem;
  margin-bottom: 0.4rem;
  align-self: flex-end;

  p {
    color: ${props => props.theme.colors[500]};
  }

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
  align-items: center;
  position: relative;
  padding: 0.75rem 0 0.75rem 0.8rem;
  border: ${props => props.$isInputFocused ? `1px solid ${props.theme.colors[400]}` : `1px solid ${props.theme.colors[100]}`};  
  border-radius: 8px;
  gap: 0.4rem;
`;

const StyledTextArea = styled.textarea`
  flex: 1;
  line-height: 1.5;
  border: none;
  outline: none;
  resize: none;
  padding: 0;
  padding-right: 48px;
  max-height: 100px;
  

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors[100]};
    border-radius: 8px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors[200]};
  }
`;

const SendBox = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.theme.colors[500]};
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  position: absolute;
  right: 10px;
  bottom: 6px;

  @media (max-width: 768px) {
    padding: 7px;
  }
  
  //&:hover {
  //  background-color: ${props => props.theme.colors[600]};
  //}
  
  //&:active {
  //  background-color: ${props => props.theme.colors[700]};
  //}

`;

export default Chatbot;
