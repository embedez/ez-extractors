import * as fs from 'fs';
import * as path from 'path';
import {IEntry} from "./src/@types";

const args = process.argv.slice(2);

const extractorArgument = args.find((arg) => arg.startsWith('-e'));
const idArgument = args.find((arg) => arg.startsWith('-id'));
const urlArgument = args.find((arg) => arg.startsWith('-url'))

const extractor = extractorArgument ? extractorArgument.split('=')[1] : undefined;
const id = idArgument ? idArgument.split('=')[1] : undefined;
const url = urlArgument ? urlArgument.split('=')[1] : undefined;

console.log(args)

if (!extractor) {
    console.error("Extractor argument must be provided with -e=example flag");
    process.exit(1);
}

if (!id && !url) {
    console.error("ID argument must be provided with -id=requestId flag");
    process.exit(1);
}

if (!url && !id) {
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

    const entry = await router.id(url)
    console.log(entry);
    if (entry) console.log(await scraper.rawGetPosts(entry));
}

getInputAndPerformAction().catch(console.error);