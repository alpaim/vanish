"use server";

import { getChatHash } from "@/lib/string/getChatHash";
import { redis } from "@/lib/redis/redis";
import { Message } from "@/types/message";

const prepareMessage = (rawMessage: string): Message => {
    const messageFromB64 = Buffer.from(rawMessage, "base64").toString("utf-8");
    const messageJSON: Message = JSON.parse(messageFromB64);

    return {
        id: messageJSON.id,
        date: messageJSON.date,
        from: messageJSON.from,
        to: messageJSON.to,
        body: messageJSON.body,
    };
};

export const subscribeToChat = async (a: string, b: string) => {
    const chatHash = getChatHash(a, b);
    let cleanup: () => Promise<void>;

    const stream = new ReadableStream({
        async start(controller) {
            const subscriber = redis.duplicate();
            await subscriber.psubscribe(`chat:${chatHash}:*`);
            subscriber.on("pmessage", (pattern, channel, message) => {
                try {
                    const preparedMessage = prepareMessage(message);
                    controller.enqueue(preparedMessage);
                } catch (error) {
                    console.error("Error sending message", error);
                }
            });

            cleanup = async () => {
                await subscriber.punsubscribe(`chat:${chatHash}:*`);
                await subscriber.quit();
            };

        }, cancel() {
            cleanup?.();
        },
    });

    return stream;
};