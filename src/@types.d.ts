export type sites = "tiktok" | "twitter" | "tiktok" | "instagram" | "reddit"
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
    type: 'profile' | 'post'
    timestamp?: Date;
    site: sites;
    views?: number;
    ids?: string[];
    requestId?: string;
    requestUrl?: string;
}

type IEntry = BaseEntry;