"use client";

import { useChatStore, useUserSettings } from "@/store/store";
import { useEffect, useState } from "react";
import { subscribeToChat } from "@/api/stream/subscribeToChat";
import { Message } from "@/types/message";
import { delMessage } from "@/api/messages/delMessage";
import { getChat } from "@/api/messages/getChat";

interface ChatWorkerProps {
    initialKey: string
}

export const ChatWorker = ({ initialKey }: ChatWorkerProps): null => {
    const keypair = useUserSettings(state => state.keypair);

    const isStoreHydrated = useUserSettings(state => state.isHydrated);

    const addMessages = useChatStore(state => state.addMessages);

    const [isInitiallyFetched, setIsInitiallyFetched] = useState(false);

    useEffect(() => {
        if (!isStoreHydrated) {
            return;
        }

        if (!keypair) {
            return;
        }

        if (isInitiallyFetched) {
            return;
        }

        const f = async () => {
            const messages = await getChat(keypair.publicKey, initialKey);
            addMessages(messages);

            messages.forEach((message) => {
                if (message.from === keypair.publicKey) {
                    return;
                }

                delMessage(keypair.publicKey, initialKey, message.id).then();
            });
            setIsInitiallyFetched(true);
        };

        f().then();

    }, [isInitiallyFetched, isStoreHydrated, keypair]);

    useEffect(() => {
        if (!isStoreHydrated) {
            return;
        }

        if (!keypair) {
            return;
        }

        let reader: ReadableStreamDefaultReader;
        let isActive = true;

        const subscription = async () => {
            const stream = await subscribeToChat(keypair.publicKey, initialKey);

            if (!isActive) return;

            reader = stream.getReader();

            try {
                while (isActive) {
                    const { done, value } = await reader.read();

                    if (done) { break; }

                    const message: Message = value;

                    if (!message) { continue; }

                    const m: Message[] = [message];

                    if (message.from === keypair.publicKey) {
                        continue;
                    }

                    delMessage(keypair.publicKey, initialKey, message.id);

                    addMessages(m);
                }
            } catch (error) {
                console.error("Reading error:", error);
            }
        };

        subscription().then();

        return () => {
            console.log("cleaning");
            isActive = false;

            if (reader) {
                reader.cancel()
                    .then(() => reader.releaseLock())
                    .catch(console.error);
            }
        };

    }, [keypair, isStoreHydrated]);

    return null;
};