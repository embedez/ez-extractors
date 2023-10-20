# ez-extractors

This project is a collection of tools designed to facilitate information extraction from multiple sources.

We use TypeScript as our primary language, coupled with various JavaScript libraries as `cheerio`, `dotenv`, and `axios`. For package management, `npm`, a Node.js package manager is used.

## Project Structure
The project folder structure is as follows:

```
└ src                   
    └── extractors          # Folder containing individual extractor scripts
        ├── example         # Example scraper script
        └── template        # Typescript and Class functions
       
```

## Setup
Before you can run an extractor, ensure you have [Node.js](https://nodejs.org/en/download/) and npm installed. Afterward, navigate to the project directory and run `npm install` to install all the necessary dependencies.

## Running an Extractor

If you want to run a specific extractor located in the `./src/extractors/` directory, you can use the following command:

`
npm run dev -- -e={foldername} -id={id need to scrape}
`


Replace `{foldername}` with the name of the folder where your extractor is located, and `{id need to scrape}` with the specific id you need to scrape.

## Example Extractor
An example of a scraper can be found in `./src/extractors/example`.

Please feel free to explore it for better understanding on how to leverage ez-extractors for your own information extraction tasks.

## Support
If you have any inquiries, issues or suggestions, you can raise an issue or a pull request here. For real-time discussions and quick support, join our [Discord Server](https://discord.gg/cTjbQNr9M9).

Happy scraping!