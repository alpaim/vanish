"use client";

export const importKey = (keyBase64: string): ArrayBuffer => {

    const binaryString = atob(keyBase64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
};