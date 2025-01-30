"use server";

import { redis } from "@/lib/redis/redis";

export interface DelOneTimeCodeChatMessage {
    oneTimeCode: string;
}

export const delOneTimeCode = async (
    { oneTimeCode }: DelOneTimeCodeChatMessage,
): Promise<void> => {
    await redis.del(`hs:${oneTimeCode}`);
} ;
