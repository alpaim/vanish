import { getStringHash } from "@/lib/string/getStringHash";

export const getChatHash = (a: string, b: string): string => {
    const sortedAddresses = [a, b].sort();
    const chatHash = getStringHash(sortedAddresses.join(""));

    return chatHash;
};