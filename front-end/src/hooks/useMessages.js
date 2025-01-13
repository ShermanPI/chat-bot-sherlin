import { useState } from "react";

export const useMessages = () => {
    const [messages, setMessages] = useState([
        { message: "Hola, ¿en qué puedo ayudarte?", isBot: true },
        { message: "Hola, ¿en qué puedo ayudarte?", isBot: false }]);

    const [currentMessage, setCurrentMessage] = useState("");

    const sendMessage = () => {
        setMessages([...messages, { message: currentMessage, isBot: false }]);
        setCurrentMessage("");
    }


    return { messages, sendMessage, currentMessage, setCurrentMessage };
}