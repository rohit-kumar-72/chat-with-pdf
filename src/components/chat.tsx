'use client'
import axios from "axios";
import { useState } from "react";

const Chat = () => {
    const [messages, setMessages] = useState<{ user: string; text: string }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false)

    const sendMessage = async () => {
        setLoading(true)
        let question = ''
        if (input.trim()) {
            question = input
            setMessages(prev => [...prev, { user: "You", text: input }]);
            setInput("");
        }
        try {
            const response = await axios.post('/api/ai', {
                question
            })
            if (response.data.success) {
                console.log(response.data)
                setMessages(prev => [...prev, { user: "Ai", text: response.data.data }])
            }
        } catch (error) {
            console.log("error in fetching answer", error)
            setMessages(prev => [...prev, { user: "AI", text: "api error" }])
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-screen justify-between">
            {/* Header */}
            <div className="bg-blue-500 text-white p-4 text-center">
                <h1 className="text-lg font-semibold">Simple Chat</h1>
            </div>

            {/* Chat display area */}
            <div className="flex flex-col p-4 overflow-y-auto w-screen">
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <div className={`w-full flex ${msg.user === "You" ? "justify-end" : "justify-start"}`}>
                            <div
                                key={index}
                                className={`mb-2 p-2 rounded-lg ${msg.user === "You"
                                    ? "bg-blue-500 text-white "
                                    : "bg-gray-300 text-black "
                                    } max-w-xs`}
                            >
                                <p className="font-semibold">{msg.user}:</p>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No messages yet.</p>
                )}
            </div>

            {/* Input area */}
            <div className="p-4 flex">
                <input
                    type="text"
                    className="flex-grow p-2 border rounded-lg border-gray-300 text-black"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    disabled={loading}
                />
                <button
                    className={`ml-2 bg-blue-500 text-white p-2 rounded-lg ${loading && "opacity-70"}`}
                    onClick={sendMessage}
                    disabled={loading}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chat;
