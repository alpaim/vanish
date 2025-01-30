"use server";

import { redis } from "@/lib/redis/redis";

export interface JoinOneTimeCodeChatMessage {
    publicAddress: string;

    oneTimeCode: string;
}

export const joinOneTimeCodeChat = async (
    { oneTimeCode, publicAddress }: JoinOneTimeCodeChatMessage,
): Promise<string | undefined> => {

    const theirPublicAddress = await redis.get(`hs:${oneTimeCode}`);

    if (!theirPublicAddress) { return undefined; }

    if (theirPublicAddress === publicAddress) {return undefined; }

    const hs_expire = parseInt(process.env.VANISH_HS_EXPIRE || "21600");

    await redis.setex(`hs:${oneTimeCode}`, hs_expire, publicAddress);
    await redis.publish(`hs:${oneTimeCode}`, publicAddress);

    return theirPublicAddress;
} ;
