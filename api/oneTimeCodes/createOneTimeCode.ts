"use server";

import { redis } from "@/lib/redis/redis";

interface createOneTimeCodeParams {
    publicAddress: string
}

export const createOneTimeCode = async (
    { publicAddress }: createOneTimeCodeParams,
): Promise<string | undefined> => {
    const maxAttempts = 10;
    let attempts = 0;

    const otc_expire = parseInt(process.env.VANISH_OTC_EXPIRE || "21600");

    while (attempts < maxAttempts) {
        const code = Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0");

        const result = await redis.setex(`hs:${code}`, otc_expire, publicAddress);

        if (result === "OK") {
            return code;
        }

        attempts++;
    }

    return undefined;
};