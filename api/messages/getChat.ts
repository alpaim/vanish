"use server";

import { redis } from "@/lib/redis/redis";
import { Message } from "@/types/message";
import { getChatHash } from "@/lib/string/getChatHash";

export const getChat = async (a: string, b: string): Promise<Message[]> => {
    const chatHash = getChatHash(a, b);

    const keys = await redis.keys(`chat:${chatHash}:*`);

    if (keys.length === 0) {return [];}

    const values = await redis.mget(keys);

    if (!values || values[0] === null) {return [];}

    const noNullValues = values.filter(v => v !== null);

    const unsortedMessages: Message[] = noNullValues.map(m => {
        const messageFromB64 = Buffer.from(m, "base64").toString("utf-8");
        const messageJSON: Message = JSON.parse(messageFromB64);

        return {
            id: messageJSON.id,
            from: messageJSON.from,
            to: messageJSON.to,
            date: messageJSON.date,
            body: messageJSON.body,
        };
    });

    const sortedMessages: Message[] = unsortedMessages.sort((a, b) => {
        const dateA = Number.parseInt(a.date);
        const dateB = Number.parseInt(b.date);

        return dateB - dateA;
    });

    return sortedMessages;
};