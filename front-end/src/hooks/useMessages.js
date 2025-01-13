import { useEffect, useState } from "react";
import { sendMessageToChatBot } from "../services/sendMessage";

export const useMessages = () => {
    const [messages, setMessages] = useState([]);

    const [currentMessage, setCurrentMessage] = useState("");

    const addMessage = async ({message, isBot = false}) => {
        setMessages([...messages, { message, isBot }]);
        setCurrentMessage("");
    }

    useEffect(() => {
        // addMessage({ message: "Hola, ¿en qué puedo ayudarte?", isBot: true });
        sendMessageToChatBot("start").then((response) => {
            addMessage({ message: response, isBot: true });
        });
    }, []);


    return { messages, addMessage, currentMessage, setCurrentMessage };
}