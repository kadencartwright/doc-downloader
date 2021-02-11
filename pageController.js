const pageScraper = require('./pageScraper');
const fileDownloader = require('./fileDownloader')
async function scrapeAll(browserInstance){
    let browser;
    try{
        browser = await browserInstance;
        await fileDownloader.scraper(browser);

    }
    catch(err){
        console.log("Could not resolve the browser instance => ", err);
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)