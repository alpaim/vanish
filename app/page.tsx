"use client";

import { useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { useChatStore, useUserSettings } from "@/store/store";
import { joinOneTimeCodeChat } from "@/api/oneTimeCodes/joinOneTimeCode";
import { createOneTimeCode } from "@/api/oneTimeCodes/createOneTimeCode";

export default function Home() {
    const [code, setCode] = useState("");
    const keypair = useUserSettings(state => state.keypair);
    const oneTimeCode = useUserSettings(state => state.oneTimeCode);
    const setOneTimeCode = useUserSettings(state => state.setOneTimeCode);

    const resetUser = useUserSettings(state => state.reset);
    const resetMessages = useChatStore(state => state.reset);

    const router = useRouter();

    const handleGenerateCode = async () => {
        if (!keypair) {return;}

        const code = await createOneTimeCode({ publicAddress: keypair.publicKey });

        if (!code) {return;}

        if (oneTimeCode) {return;}

        setOneTimeCode(code);
    };

    const handleJoinChat = async () => {
        if (!code) {
            return;
        }

        if (!keypair) {
            return;
        }

        const theirPublicAddress = await joinOneTimeCodeChat({ oneTimeCode: code, publicAddress: keypair.publicKey });

        if (!theirPublicAddress) {return;}

        setOneTimeCode(undefined);
        router.push(`/chat?key=${encodeURIComponent(theirPublicAddress)}`);
    };

    const handleCopyOneTimeCode = async () => {
        if (!oneTimeCode) {
            return;
        }

        await navigator.clipboard.writeText(oneTimeCode);
    };

    const handleCreateNewIdentity = async () => {
        localStorage.clear();
        resetUser();
        resetMessages();
        redirect("/");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold mb-6 text-center">Vanish</h1>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="code" className="block font-medium text-gray-700">
                            Enter one time chat code:
                        </label>
                        <input
                            type="number"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="mt-1 block w-full text-center uppercase px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={handleJoinChat}
                        disabled={!code}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Join Chat
                    </button>
                    {!oneTimeCode && (
                        <button
                            onClick={handleGenerateCode}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            Generate New Code
                        </button>
                    )}
                    {oneTimeCode && (
                        <div className="mt-4 text-white cursor-pointer" onClick={handleCopyOneTimeCode}>
                            <p className="mt-1 text-black break-all text-center text-3xl">{
                                oneTimeCode.slice(0, 3) + " " + oneTimeCode.slice(3)
                            }</p>
                        </div>
                    )}
                    <button
                        onClick={handleCreateNewIdentity}
                        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Create New Identity
                    </button>
                </div>
            </div>
        </div>
    );
}
