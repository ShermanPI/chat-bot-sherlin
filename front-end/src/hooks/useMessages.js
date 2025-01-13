import { useEffect,  useState } from "react";
import { sendMessageToChatBot } from "../services/sendMessage";

export const useMessages = () => {
    const [messages, setMessages] = useState([]);

    const [currentMessage, setCurrentMessage] = useState("");

    const addMessage = async ({ message, isBot = false }) => {

        const newMessages = [...messages, { message, isBot }];

        setMessages(newMessages);
        setCurrentMessage("");

        const response = await sendMessageToChatBot(message)
        
        setMessages([...newMessages, { message: response, isBot: true }]);
    }

    useEffect(() => {
        sendMessageToChatBot("start").then((response) => {
            setMessages([{ message: response, isBot: true }]);
        })
    }, []);


    return { messages, addMessage, currentMessage, setCurrentMessage };
}