export type sites = "twitter" | "tiktok" | "instagram" | "reddit"
export type medias = 'video' | 'photo' | 'audio' | 'gif'

export interface embedMedia {
    type: medias;
    url: string;
    thumbnail: string | null;
    duration: number | null;
    title?: string;
    height: number;
    width: number;
}

interface BaseEntry {
    _id?: string;
    timestamp?: Date;
    site: sites;
    views?: number;
    ids?: string[];
}

interface EntryWithRequestId extends BaseEntry {
    requestId: string;
    requestUrl?: never;
}

interface EntryWithRequestUrl extends BaseEntry {
    requestId?: never;
    requestUrl: string;
}

type IEntry = EntryWithRequestId | EntryWithRequestUrl;