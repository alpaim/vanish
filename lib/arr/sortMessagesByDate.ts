import { Message } from "@/types/message";

export const sortMessagesByDate = (messages: Message[]): Message[] => {
    return [...messages].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        return dateB.getTime() - dateA.getTime();
    });
};