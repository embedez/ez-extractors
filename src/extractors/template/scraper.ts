import type {AxiosRequestConfig} from "axios";
import axios from "axios";
import {IEntry} from "../../@types";
import getCorsProxy from "../../utils/getCorsProxy";

export class Scraper implements IScraper {
    settings: {
        proxyRequests?: boolean
        corsProxyUrl?: string
    } = {
        corsProxyUrl: process.env.proxy_url
    }

    async rawGet(id: IEntry): Promise<embedFetch | embedFetchError> {
        return {
            type: "tiktok",
            reason: "Not implemented yet"
        } as embedFetchError
    }

    async error(id: string): Promise<embedFetchError> {
        return {
            type: "tiktok",
            reason: "Not implemented yet"
        } as embedFetchError
    }

    fetch(config: AxiosRequestConfig) {
        if (this?.settings?.proxyRequests) {
            const proxy = getCorsProxy()
            config.url = proxy + config?.url
        }
        return axios(config)
    }

    cors(link?: string) {
        if (!link) return link as undefined
        return `${this.settings.corsProxyUrl}/proxy/${encodeURIComponent(link)}?forcedHeadersProxy=%7B%22Cross-Origin-Resource-Policy%22%3A%22*%22%7D`
    }
}

export interface IScraperSettings {
    proxyRequests?: boolean;
    corsProxyUrl?: string;
}

export interface IScraper {
    settings: IScraperSettings;

    rawGet(id: IEntry): Promise<embedFetch | embedFetchError>;

    error(id: string): Promise<embedFetchError>;

    fetch(config: AxiosRequestConfig): Promise<any>; // you may need to replace 'any' with actual return type
    cors(link?: string): string | undefined;
}

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

export interface embedFetch {
    type: sites;
    id: string;
    incorrectId?: boolean;
    user: {
        name: any;
        displayName: any;
        region: any;
        followers: any;
        friends: any;
        pictures: {
            url: any;
            banner: any | null;
        };
    };
    content: {
        id: any;
        text: string | null;
        media: embedMedia[];
        embedUrl: string;
        generatedMedia?: embedMedia[] | null;
        statistics: {
            shares: number;
            comments: number;
            follows: number;
            views: number;
            likes: number;
        };
    };
}

export interface embedFetchError {
    type: sites;
    id?: string;
    reason: string;
    cause?: string;
    code?: number;
}