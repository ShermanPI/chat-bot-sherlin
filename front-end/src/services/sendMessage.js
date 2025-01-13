export const sendMessage = async (message) => {
    try {
        const response = await fetch(import.meta.env.VITE_SHERLIN_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userMessage: message })
        });
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Error enviando el mensaje:", error);
        return "Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.";
    }
}