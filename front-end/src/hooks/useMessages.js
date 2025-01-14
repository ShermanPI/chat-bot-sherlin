import { useEffect,  useState } from "react";
import { sendMessageToChatBot } from "../services/sendMessage";

export const useMessages = () => {
    const [messages, setMessages] = useState([]);
    const [chatThinking, setChatThinking] = useState(false);

    const [currentMessage, setCurrentMessage] = useState("");

    const addMessage = async ({ message, isBot = false }) => {

        const newMessages = [...messages, { message, isBot }];

        setMessages(newMessages);
        setCurrentMessage("");

        setChatThinking(true);
        const response = await sendMessageToChatBot(message)
        
        setChatThinking(false);
        setMessages([...newMessages, { message: response, isBot: true }]);
    }

    useEffect(() => {
        // setChatThinking(true);
        setMessages([{ message: "¡Hola! Soy Sherlin, tu asistente de análisis de opiniones. Puedo ayudarte a explorar opiniones sobre productos. Pregúntame lo que quieras saber.", isBot: true }]);
        // sendMessageToChatBot("start").then((response) => {
        //     setChatThinking(false);
        // })
    }, []);


    return { messages, addMessage, currentMessage, setCurrentMessage, chatThinking };
}