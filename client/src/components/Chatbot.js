import { useState } from 'react'
import { sendMessageToApi } from '../services/api'

function Chatbot() {  
  const [ value, setValue ] = useState('')
  const [ messages, setMessages] = useState([])

  const sendMessage = async () => {
    setMessages(messages => [...messages, {role: 'user', content: value}])
    try {
      const data = await sendMessageToApi(value)
      setMessages(messages => [...messages, {role: 'Mark', content: data.choices[0].message.content}])
      setValue('')   
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="chatbot">
      <div className="chat-area">
        {messages.map((message, i) => (
          <div key={i} className={message.role}>
            <p>{message.role}: {message.content}</p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input type="text" value={value} onChange={(e) => setValue(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  )
}

export default Chatbot;
