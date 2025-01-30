"use server";

import { redis } from "@/lib/redis/redis";

export interface ResolveOneTimeCodeMessage {
    oneTimeCode: string;
}

export const resolveOneTimeCode = async (
    { oneTimeCode }: ResolveOneTimeCodeMessage,
): Promise<string | undefined> => {

    const theirPublicAddress = await redis.get(`hs:${oneTimeCode}`);

    if (!theirPublicAddress) {
        return undefined;
    }

    return theirPublicAddress;
} ;
