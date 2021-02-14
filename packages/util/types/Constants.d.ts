export declare enum Statuses {
    READY = 0,
    CONNECTING = 1,
    RECONNECTING = 2,
    IDLE = 3,
    NEARLY = 4,
    DISCONNECTED = 5,
    WAITING_FOR_GUILDS = 6,
    IDENTIFYING = 7,
    RESUMING = 8
}
export declare const WSCodes: {
    1000: string;
    4004: string;
    4010: string;
    4011: string;
    4013: string;
    4014: string;
};
export default class Constants {
    static Statuses: typeof Statuses;
    static WSCodes: {
        1000: string;
        4004: string;
        4010: string;
        4011: string;
        4013: string;
        4014: string;
    };
}
