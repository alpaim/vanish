"use server";

import { redis } from "@/lib/redis/redis";

export const subscribeToHandshake = async (code: string) => {
    let cleanup: () => Promise<void>;

    const stream = new ReadableStream({
        async start(controller) {
            const subscriber = redis.duplicate();

            await subscriber.psubscribe(`hs:${code}`);
            subscriber.on("pmessage", (pattern, channel, message) => {
                try {
                    controller.enqueue(message);
                } catch (error) {
                    console.error("Error sending message", error);
                }
            });

            cleanup = async () => {
                await subscriber.punsubscribe(`hs:${code}`);
                await subscriber.quit();
            };

        }, cancel() {
            cleanup?.();
        },
    });

    return stream;
};