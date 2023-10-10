import {Routing} from "../template/routing";
import extractId from "../../utils/extractId"
import {NextURL} from "next/dist/server/web/next-url";


export default class exampleRouting extends Routing {
    async id(pathname: string, nextUrl?: NextURL): Promise<{ id: string } | null> {
        const data: any[] = [];

        // https://embedez.com/https://twitter.com/fuck/status/n-9oiujnsdfhg
        data.push(extractId("/https:/twitter.com/:user/status/:id", pathname));
        data.push(extractId("/https:/x.com/:user/status/:id", pathname));

        data.push(extractId("/:user/status/:id", pathname));

        const found = data.find((d) => d?.id !== undefined);
        if (!found) return null;

        return {id: found.id}
    }
}