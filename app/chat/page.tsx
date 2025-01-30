"use client";

import { Chat } from "@/components/chat/Chat";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Chat/>
        </Suspense>
    );
}
