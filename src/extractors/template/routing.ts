import { NextURL } from "next/dist/server/web/next-url";
import { IEntry } from "../../@types";

export class Routing implements IRouting {
  async id(
    pathname: string,
    nextUrl?: NextURL,
  ): Promise<IEntry | null> {
    return null;
  }
}

export interface IRouting {
  id: (pathname: string, nextUrl?: NextURL) => Promise<IEntry | null>;
}