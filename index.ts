import * as fs from 'fs';
import * as path from 'path';
import {IEntry} from "./src/@types";

const args = process.argv.slice(2);

const extractorArgument = args.find((arg) => arg.startsWith('-e'));
const typeArgument = args.find((arg) => arg.startsWith('-type'));
const urlArgument = args.find((arg) => arg.startsWith('-url'))

const extractor = extractorArgument ? extractorArgument.split('=')[1] : undefined;
const type = typeArgument ? typeArgument.split('=')[1] : undefined || 'post';
const url = urlArgument ? urlArgument.split('=')[1] : undefined;
console.log(args)

if (!extractor) {
    console.error("Extractor argument must be provided with -e=example flag");
    process.exit(1);
}

if (!url) {
    console.error("ID argument must be provided with -url flag");
    process.exit(1);
}

async function getInputAndPerformAction() {
    const extractorsDir = './src/extractors';

    console.log(extractorsDir, extractor)

    const routingModulePath = path.join(fs.realpathSync('./'), extractorsDir, extractor, '/routing.ts');
    const scraperModulePath = path.join(fs.realpathSync('./'), extractorsDir, extractor, '/scraper.ts');

    console.log(routingModulePath)

    const RoutingClass = await require(routingModulePath)
    const ScraperClass = await require(scraperModulePath);

    const router = new RoutingClass.default()
    const scraper = new ScraperClass.default();

    const entry = await router.id(url) as IEntry | null
    console.log("Entry", entry);
    if (entry) {
        if (entry.type == "post") {
            console.log(await scraper.rawGetPosts(entry))
        } else {
            console.log(await scraper.rawGetProfile(entry))
        }
    }
}

getInputAndPerformAction().catch(console.error); 