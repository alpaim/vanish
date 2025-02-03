"use client";

import { useUserSettings } from "@/store/store";

export const EncryptionViewToggle = () => {
    const isShowEncrypted = useUserSettings(state => state.isShowEncrypted);
    const setShowEncrypted = useUserSettings(state => state.setShowEncrypted);

    return (
        <button
            onClick={() => setShowEncrypted(!isShowEncrypted)}
            className={`px-3 py-1 rounded-full text-sm font-medium ${
                isShowEncrypted ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
        >
            {isShowEncrypted ? "Encrypted view" : "Decrypted view"}
        </button>
    );
};
