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
    const directories = fs.readdirSync(extractorsDir, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && dirent.name !== 'template')
        .map(dirent => dirent.name);

    const scraperModulePath = path.join(fs.realpathSync('./'), extractorsDir, extractor, '/scraper.ts');

    const ScraperClass = await require(scraperModulePath);

    const scraper = new ScraperClass.default();
    console.log(await scraper.rawGet({ requestId: id?.trim(), requestUrl: url?.trim() } satisfies Partial<IEntry>));
}

getInputAndPerformAction().catch(console.error);