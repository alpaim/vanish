"use server";

import { redis } from "@/lib/redis/redis";
import { BaseMessage, Message } from "@/types/message";
import { nanoid } from "nanoid";
import { getChatHash } from "@/lib/string/getChatHash";

export const sendMessage = async (message: BaseMessage): Promise<Message | undefined> => {
    const chatHash = getChatHash(message.from, message.to);
    const messageNanoId = nanoid();

    const messageId = [chatHash, messageNanoId].join(":");

    const processedMessage: Message = {
        id: messageId,
        date: Date.now().toString(),
        ...message,
    };

    const messageJSON = JSON.stringify(processedMessage);
    const messageUTF8 = Buffer.from(messageJSON).toString("utf-8");
    const messageB64 = Buffer.from(messageUTF8).toString("base64");

    const msg_expire = parseInt(process.env.VANISH_MSG_EXPIRE || "21600");

    await redis.setex(`chat:${chatHash}:${messageId}`, msg_expire, messageB64);
    await redis.publish(`chat:${chatHash}:${messageId}`, messageB64);

    return processedMessage;
};