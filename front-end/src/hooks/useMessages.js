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
        setChatThinking(true);
        sendMessageToChatBot("start").then((response) => {
            setChatThinking(false);
            setMessages([{ message: response, isBot: true }]);
        })
    }, []);


    return { messages, addMessage, currentMessage, setCurrentMessage, chatThinking };
}