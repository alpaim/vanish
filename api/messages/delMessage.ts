"use server";

import { getChatHash } from "@/lib/string/getChatHash";
import { redis } from "@/lib/redis/redis";

export const delMessage = async (a: string, b: string, mId: string): Promise<void> => {
    const chatHash = getChatHash(a, b);

    await redis.del(`chat:${chatHash}:${mId}`);
};