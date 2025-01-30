import { EncryptedMessage, Message } from "@/types/message";
import { Keypair } from "@/types/keypair";
import { importKey } from "@/lib/crypto/importKeyFromBase64";
import { generateSharedSecret } from "@/lib/crypto/generateSharedSecret";
import { decryptMessage } from "@/lib/crypto/decryptMessage";

export const decryptMessages = async (messages: Message[], keypair: Keypair, theirPublicAddress: string): Promise<Message[]> => {
    if (keypair === undefined) { return []; }

    if (theirPublicAddress === "") { return []; }

    const res = await Promise.all(messages.map(async (m) => {
        const encryptedMessageRaw = m.body.data;
        const encryptedMessageFromB64 = Buffer.from(encryptedMessageRaw, "base64").toString();
        const encryptedMessage: EncryptedMessage = JSON.parse(encryptedMessageFromB64);

        const myPrivateKeyBuffer = importKey(keypair.privateKey);
        const theirPublicKeyBuffer = importKey(theirPublicAddress);
        const sharedSecret = await generateSharedSecret(myPrivateKeyBuffer, theirPublicKeyBuffer);

        const decryptedMessage = await decryptMessage(encryptedMessage, sharedSecret);

        return {
            ...m,
            body: {
                ...m.body,
                data: decryptedMessage,
            },
        };
    }));

    return res;
};