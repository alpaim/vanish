"use client";

import { useSearchParams } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";
import Link from "next/link";
import { ChatWorker } from "@/components/workers/ChatWorker";
import { EncryptionViewToggle } from "@/components/chat/EncryptionViewToggle";

export const Chat = () => {
    const searchParams = useSearchParams();
    const key = searchParams.get("key") || "";

    return (
        <div className="min-h-screen-patched max-h-dvh grid grid-rows-[auto_1fr] bg-gray-100">
            <header className="h-fit bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <Link href={"/"}>
                            <h1 className="text-3xl font-bold text-gray-900">Vanish</h1>
                        </Link>
                        <div className="flex items-center">
                            <EncryptionViewToggle />
                        </div>
                    </div>
                </div>
            </header>
            <main className="h-full overflow-hidden">
                <div className="h-full max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="h-full px-4 py-6 sm:px-0">
                        <div className="h-full border-4 border-dashed border-gray-200 rounded-lg">
                            <ChatWorker initialKey={key}/>
                            <ChatWindow initialKey={key}/>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
