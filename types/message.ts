export interface Message extends BaseMessage {
    id: string;
    date: string;
}

export interface BaseMessage {
    from: string;
    to: string;

    body: MessageBody;
}

export interface MessageBody {
    data: string;
}

export interface EncryptedMessage {
    iv: string;
    encryptedData: string;
}