import { useState, useEffect } from 'react';
import './App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from '@chatscope/chat-ui-kit-react';
import { Container, Grid } from '@mui/material';
import ActivityDashboard from './pages/Activity'; 

const API_KEY = "YOUR_API_KEY";

function App() {

  const [typing, setTyping] = useState(false);

  // Access stored messages from local Storage. As to handle logging in and out. 
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    return savedMessages ? JSON.parse(savedMessages) : [
      {
        message: "Hello I'm ChatGPT",
        sender: "ChatGPT",
        direction: "incoming"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
  }, [messages]);
  
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "User",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage]; // all old messages + new message

    // update messages state
    setMessages(newMessages);

    // Set a typing indicator, chatGPT is typing
    setTyping(true);  // this will be infinite 
    if (Notification.permission === "granted") {
      new Notification("New message sent", {
      body: message,
    });
  }
    // process the message to CHATGPT send and see response
    await processMessageToChatGPT(newMessages); // make sure we use the newMessages, becase messages is being scheduled to set, not set. 

  }

  //https://platform.openai.com/docs/api-reference/making-requests
  async function processMessageToChatGPT(chatMessages){
    // Based on this, chatMessages would be "messages": [{"role": "user" or "ChatGPT", "content": "Message Content here"}],
    // apiMessages {"role": "user" or "assistant", "content": "Message Content here"}

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender === "User"){
        role = "user";
      }
      else{
        role = "assistant";
      }
      return {
        role: role,
        content: messageObject.message
      }
    });
    
    const systemMessage = {
      role: "system",
      content: "Explain like I'm 10 years old." // speak like a pirate
    }

    // role : user -> mesage from user, "assiatnt -> reponse", "System -> one initial message how want to talk."
    const apiRequestBody = {
      "model" : "gpt-3.5-turbo",
      "messages": [
        systemMessage,  // have a specific message form. 
        ...apiMessages // [message 1, message 2] as array
      ]
    }

    await fetch ("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization" : "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      console.log(data);
      console.log(data.choices[0].message.content);

      if (Notification.permission === "granted") {
        new Notification("New message from ChatGPT", {
          body: chatMessages,
        });
      }

      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "ChatGPT",
          direction: "incoming"
        }]
      );
      setTyping(false);
    });
  }
  
  return (
    <Container>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <div style={{ position: "relative", height: "800px", width: "100%" }}>
            <MainContainer>
              <ChatContainer>
                <MessageList
                  scrollBehavior='smooth'
                  typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing..." /> : null}
                >
                  {messages.map((message, index) => (
                    <Message key={index} model={message} />
                  ))}
                </MessageList>
                <MessageInput placeholder='Type message here' onSend={handleSend} />
              </ChatContainer>
            </MainContainer>
          </div>
        </Grid>
        <Grid item xs={12} md={4}>
          <ActivityDashboard />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
