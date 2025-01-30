"use client";

import { useEffect, useState } from "react";
import { useChatStore, useUserSettings } from "@/store/store";
import { generateSharedSecret } from "@/lib/crypto/generateSharedSecret";
import { importKey } from "@/lib/crypto/importKeyFromBase64";
import { sendMessage } from "@/api/messages/sendMessage";
import { BaseMessage, Message } from "@/types/message";
import { decryptMessages } from "@/lib/crypto/decryptMessages";
import { encryptMessage } from "@/lib/crypto/encryptMessage";
import { sortMessagesByDate } from "@/lib/arr/sortMessagesByDate";

interface ChatWindowProps {
    initialKey: string
}

export function ChatWindow({ initialKey }: ChatWindowProps) {
    const [input, setInput] = useState("");

    const keypair = useUserSettings(state => state.keypair);

    const encryptedMessages = useChatStore(state => state.messages);
    const addEncryptedMessages = useChatStore(state => state.addMessages);

    const [messages, setMessages] = useState<Message[]>([]);
    const [optimisticMessages, setOptimisticMessages] = useState<Message[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!keypair) {
            return;
        }

        if (!input.trim()) {
            return;
        }

        const myPrivateKeyBuffer = importKey(keypair.privateKey);
        const theirPublicKeyBuffer = importKey(initialKey);
        const sharedSecret = await generateSharedSecret(myPrivateKeyBuffer, theirPublicKeyBuffer);

        const encryptedMessage = await encryptMessage(input, sharedSecret);
        const encryptedMessageJSON = JSON.stringify(encryptedMessage);
        const encryptedMessageB64 = Buffer.from(encryptedMessageJSON).toString("base64");

        const message: BaseMessage = {
            from: keypair.publicKey,
            to: initialKey,
            body: {
                data: encryptedMessageB64,
            },
        };

        const optimisticMessage: Message = {
            ...message,
            id: "optimisticId",
            date: Date.now().toString(),
            body: {
                data: input,
            },
        };

        setOptimisticMessages(prevOptimisticMessages => [...prevOptimisticMessages, optimisticMessage]);
        setInput("");

        const processedMessage = await sendMessage(message);

        if (!processedMessage) {
            return;
        }

        addEncryptedMessages([processedMessage]);
    };

    useEffect(() => {
        setOptimisticMessages([]);
    }, [messages]);

    useEffect(() => {
        if (!keypair) {
            return;
        }

        if (encryptedMessages.length === 0) {
            return;
        }

        decryptMessages(encryptedMessages, keypair, initialKey).then((m) => {
            const sortedMessages = sortMessagesByDate(m);

            setMessages(sortedMessages);
        });
    }, [keypair, encryptedMessages]);

    return (
        <div className="grid grid-rows-[1fr_auto] h-full">
            <div className="max-h-dvh overflow-y-auto p-4 gap-4 flex flex-col-reverse">
                {[...messages, ...optimisticMessages].reverse().map((msg, index) => (
                    <div key={index} className={`flex ${msg.from === keypair?.publicKey ? "justify-end" : "justify-start"}`}>
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${msg.from === keypair?.publicKey ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                        >
                            <p>{msg.body.data}</p>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
