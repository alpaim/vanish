"use client";

import { useUserSettings } from "@/store/store";
import { useEffect } from "react";
import { delOneTimeCode } from "@/api/oneTimeCodes/delOneTimeCode";
import { useRouter } from "next/navigation";
import { subscribeToHandshake } from "@/api/stream/subscribeToHandshake";

export const HandshakeWorker = (): null => {
    const router = useRouter();

    const keypair = useUserSettings(state => state.keypair);

    const oneTimeCode = useUserSettings(state => state.oneTimeCode);
    const setOneTimeCode = useUserSettings(state => state.setOneTimeCode);

    const isStoreHydrated = useUserSettings(state => state.isHydrated);

    useEffect(() => {
        if (!isStoreHydrated) {
            return;
        }

        if (!keypair) {
            return;
        }

        if (!oneTimeCode) {
            return;
        }

        let reader: ReadableStreamDefaultReader;
        let isActive = true;

        const subscription = async () => {
            const stream = await subscribeToHandshake(oneTimeCode);

            if (!isActive) return;

            reader = stream.getReader();

            try {
                while (isActive) {
                    const { done, value } = await reader.read();

                    if (done) { break; }

                    if (!value) { continue; }

                    if (value === keypair.publicKey) {
                        continue;
                    }

                    if (!oneTimeCode) {return;}

                    await delOneTimeCode({ oneTimeCode });

                    setOneTimeCode(undefined);

                    router.push(`/chat?key=${encodeURIComponent(value)}`);

                    break;
                }
            } catch (error) {
                console.error("Reading error:", error);
            }
        };

        subscription();

        return () => {
            isActive = false;

            if (reader) {
                reader.cancel()
                    .then(() => reader.releaseLock())
                    .catch(console.error);
            }
        };

    }, [keypair, oneTimeCode, isStoreHydrated]);

    return null;
};