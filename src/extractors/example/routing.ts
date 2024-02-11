import {Routing} from "../template/routing";
import extractId from "../../utils/extractId"
import {NextURL} from "next/dist/server/web/next-url";
import { IEntry } from "../../@types";


export default class exampleRouting extends Routing {
    async id(
      pathname: string,
      nextUrl?: NextURL,
    ): Promise<IEntry | null> {
      const data: any[] = [];
      data.push(extractId("twitter.com/:user/status/:id", pathname));
      data.push(extractId("x.com/:user/status/:id", pathname));
      
      const found = data.find((d) => d?.id !== undefined);
      if (!found) return null;
  
      return { 
        site: 'tiktok',
        type: "post",
        requestId: found.id 
      } as IEntry
    }
  }