import type { AxiosError, AxiosRequestConfig } from "axios";
import axios from "axios";

import { HttpsProxyAgent } from "hpagent";
import { IEntry } from "../../@types";
import { embedFetch, embedFetchError, sites } from "./types";

export class Scraper implements IScraper {
  settings: {
    proxyRequests?: boolean;
    corsProxyUrl?: string;
  } = {
    corsProxyUrl: process.env.proxy_url,
  };

  get = this.rawGetPosts.bind(this)

  async rawGetPosts(id: IEntry): Promise<embedFetch | embedFetchError> {
    throw "this should not be called " + id;
  }

  async rawGetProfile(id: IEntry): Promise<(embedFetch | embedFetchError)[]> {
    throw "this should not be called " + id;
  }

  async error(id: string): Promise<embedFetchError> {
    return {
      type: "tiktok",
      reason: "Not implemented yet",
    } as embedFetchError;
  }

  async fetch(config: FetchConfig, index: number = 0): Promise<any> {
    try {
      if (this?.settings?.proxyRequests && process.env.proxy_resi_url) {
        config.httpsAgent = new HttpsProxyAgent({
          proxy: process.env.proxy_resi_url,
        });
      }

      const data = await axios(config);

      const valid = config?.validateData?.(data.data);
      if (!valid && config?.validateData) throw valid;

      return data;
    } catch (e) {
      const error = e as AxiosError;
      if (index >= Number(process.env.maxAttempts || 0)) {
        console.error(e);
        return error;
      }
      return this.fetch(config as FetchConfig, index + 1);
    }
  }

  /**
   * @deprecated Cors proxy should be handled on a per use case
   */
  cors(link?: string | undefined) {
    if (!link) return link as undefined;
    return `${this.settings.corsProxyUrl || process.env.proxy_url}/${link}`;
  }
}

export interface IScraperSettings {
  proxyRequests?: boolean;
  corsProxyUrl?: string;
}

export interface IScraper {
  type?: sites;
  settings: IScraperSettings;

  rawGetPosts(id: IEntry): Promise<embedFetch | embedFetchError>;

  get(id: IEntry): Promise<embedFetch | embedFetchError>;

  error(id: string): Promise<embedFetchError>;

  fetch(config: FetchConfig, index?: number): Promise<any>; // you may need to replace 'any' with actual return type
  cors(link?: string): string | undefined;
}

interface FetchConfig extends AxiosRequestConfig {
  validateData?(data: any): string | boolean;
}