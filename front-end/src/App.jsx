import { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([
    { message: "Hola, ¿en qué puedo ayudarte?", isBot: true },
    { message: "Hola, ¿en qué puedo ayudarte?", isBot: false }]);

  return (
    <main>
      <div className="chat-container gray-borders">
        <b>Sherlin BOT</b>
        <div className="messages-container">
          {
            messages.map(({ message, isBot }, index) => (

              <div key={index} className={`message-container ${isBot ? "bot" : "user"}`}>
                <img className="message-pfp gray-borders" src="https://i.pinimg.com/originals/7b/7b/7b/" alt="Sherlin" />
                <div className= {`message ${isBot ? "bot" : "user"}`}>
                  {message}
                </div>
              </div>
            ))
          }
        </div>
        <div className="message-input-container">
          <input type="text" placeholder="Pregúntale algo a Sherlin..." />
          <button>Enviar</button>
        </div>
      </div>
    </main>
  );
}

export default App;