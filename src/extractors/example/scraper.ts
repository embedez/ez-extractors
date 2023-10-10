import {embedFetch, embedFetchError, embedMedia, IScraper, Scraper} from "../template/scraper";
import type {IEntry} from "../../@types";

export default class twitterScrapper extends Scraper implements IScraper {
    constructor() {
        super();
    }

    async rawGet(entry: IEntry): Promise<embedFetch | embedFetchError> {
        try {
            const request = await this.fetch({
                url: process.env.twitter_api,
                params: {},
                headers: {},
            });


            return {
                id: entry._id?.toString() || "",
                type: "instagram", // Name of the extractor
                user: {
                    name: "", // the name that does not change
                    displayName: "", // the name that changes
                    region: "", // the region of the user
                    followers: -1, // the number of followers
                    friends: -1, // the number of friends
                    pictures: {
                        url: "", // the square url of the profile picture
                        banner: "", // any other picture
                    },
                },
                content: {
                    id: "", // whatever id 
                    text: "", // description of the post
                    embedUrl: `/api/view/${entry._id}`, // overide url to be sent to embed
                    media: [{
                        duration: 0,
                        height: 0,
                        width: 0,
                        type: 'audio',
                        url: "",
                        thumbnail: "",
                    }],
                    statistics: {
                        shares: 0,
                        comments: 0,
                        follows: 0,
                        views: 0,
                        likes: 0,
                    },
                },
            };
        } catch (error: any) {
            console.log(error);
            return {
                id: entry._id?.toString(),
                reason: "serer error",
                cause: error.message,
                code: 500,
                type: "twitter",
            };
        }
    }
}