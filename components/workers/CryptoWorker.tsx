"use client";

import { useUserSettings } from "@/store/store";
import { useEffect } from "react";
import { generateKeypair } from "@/lib/crypto/generateKeypair";

export const CryptoWorker = (): null => {
    const keypair = useUserSettings(state => state.keypair);

    const setKeypair = useUserSettings(state => state.setKeypair);

    const isStoreHydrated = useUserSettings(state => state.isHydrated);

    useEffect(() => {
        if (!isStoreHydrated) {
            return;
        }

        const f = async () => {
            const kp = await generateKeypair();

            if (!kp) {return;}

            setKeypair(kp);
        };

        if (keypair === undefined) {
            f().then(() => {});
        }
    }, [keypair, isStoreHydrated]);

    return null;
};