import {NextURL} from "next/dist/server/web/next-url";

export class Routing implements IRouting {
    async id(pathname: string, nextUrl?: NextURL): Promise<{
        id: string;
        url?: string;
    } | null> {
        return null
    }
}

export interface IIdReturn {
    id: string;
    url?: string;
}

export interface IRouting {
    id: (pathname: string, nextUrl?: NextURL) => Promise<IIdReturn | null>;
}