import { useEffect, useRef } from "react";
import "./App.css";
import { useMessages } from "./hooks/useMessages";

function App() {
  const { messages, addMessage, setCurrentMessage, currentMessage } = useMessages();
  const massageContainerRef = useRef(null);

  useEffect(() => {
    console.log(import.meta.env.VITE_SHERLIN_API, 'import.meta.env.VITE_SHERLIN_API');
    messages.length && massageContainerRef.current.scrollTo(0, massageContainerRef.current.scrollHeight);
  }, [currentMessage, messages.length]);

  return (
    <main>
      <div className="chat-container gray-borders">
        <b>Sherlin BOT</b>
        <div className="messages-container small-scroll-bar" ref={massageContainerRef}>
          {
            messages.map(({ message, isBot }, index) => (

              <div key={index} className={`message-container ${isBot ? "bot" : "user"}`}>
                <img className="message-pfp gray-borders" src="https://i.pinimg.com/originals/7b/7b/7b/" alt="Sherlin" />
                <div className={`message ${isBot ? "bot" : "user"}`}>
                  {message}
                </div>
              </div>
            ))
          }
        </div>
        <form className="message-input-container" onSubmit={(e) => e.preventDefault()}>
          <input type="text"
            placeholder="Pregúntale algo a Sherlin..."
            onInput={(e) => {
              setCurrentMessage(e.target.value)
            }}
            value={currentMessage}
          />
          <button onClick={() => addMessage({message: currentMessage, isBot: false})}>Enviar</button>
        </form>
      </div>
    </main>
  );
}

export default App;