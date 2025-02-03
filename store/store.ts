import { create } from "zustand";
import { persist } from "zustand/middleware";

import { Keypair } from "@/types/keypair";
import { Message } from "@/types/message";

interface UserSettings {
    keypair: Keypair | undefined;
    setKeypair: (keypair: Keypair) => void;

    oneTimeCode: string | undefined;
    setOneTimeCode: (oneTimeCode: string | undefined) => void;

    isShowEncrypted: boolean;
    setShowEncrypted: (showEncrypted: boolean) => void;

    isHydrated: boolean;
    setHydrated: (hydrated: boolean) => void;

    reset: () => void;
}

export const useUserSettings = create<UserSettings>()(
    persist(
        (set) => ({
            keypair: undefined,
            setKeypair: (keypair) => set({ keypair }),
            oneTimeCode: undefined,
            setOneTimeCode: (oneTimeCode) => set({ oneTimeCode }),
            isShowEncrypted: false,
            setShowEncrypted: (isShowEncrypted: boolean) => set({ isShowEncrypted }),
            isHydrated: false,
            setHydrated: (state: boolean) => set({ isHydrated: state }),
            reset: () => set({
                keypair: undefined,
                oneTimeCode: undefined,
            }),
        }),
        {
            name: "vanish-settings",
            onRehydrateStorage: () => (state) => {
                state?.setHydrated(true);
            },
        },
    ),
);

interface ChatStore {
    messages: Message[];
    addMessages: (newMessages: Message[]) => void;

    reset: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    messages: [],
    addMessages: (newMessages: Message[]) => set((state) => ({
        messages: [...state.messages, ...newMessages],
    })),
    reset: () => set({
        messages: [],
    }),
}));
