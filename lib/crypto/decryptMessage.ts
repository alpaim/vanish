"use client";

import { EncryptedMessage } from "@/types/message";

export const decryptMessage = async (
    encrypted: EncryptedMessage,
    sharedSecret: ArrayBuffer,
): Promise<string> => {
    const iv = new Uint8Array(Buffer.from(encrypted.iv, "base64"));
    const encryptedData = new Uint8Array(Buffer.from(encrypted.encryptedData, "base64"));

    const keyMaterial = await window.crypto.subtle.digest(
        "SHA-256",
        sharedSecret,
    );

    const key = await window.crypto.subtle.importKey(
        "raw",
        keyMaterial,
        {
            name: "AES-CBC",
            length: 256,
        },
        false,
        ["decrypt"],
    );

    const decryptedContent = await window.crypto.subtle.decrypt(
        {
            name: "AES-CBC",
            iv: iv,
        },
        key,
        encryptedData,
    );

    return new TextDecoder().decode(decryptedContent);
};