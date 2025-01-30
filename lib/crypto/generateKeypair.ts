"use client";

import { Keypair } from "@/types/keypair";

export const generateKeypair = async (): Promise<Keypair> => {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "ECDH",
            namedCurve: "P-256",
        },
        true,
        ["deriveKey", "deriveBits"],
    );

    const privateKey = await window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey,
    );

    const publicKey = await window.crypto.subtle.exportKey(
        "spki",
        keyPair.publicKey,
    );

    return {
        publicKey: btoa(String.fromCharCode(...new Uint8Array(publicKey))),
        privateKey: btoa(String.fromCharCode(...new Uint8Array(privateKey))),
    };
};