const { DH_NOT_SUITABLE_GENERATOR } = require('constants');
const downloadDocument = require('./download').downloadDocument
const scraperObject = {
    url: 'http://docusign.net',
    async scraper(browser){
        const fs = require('fs');
        
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        await page.waitForSelector('#username')
        await page.$eval('input[name=email]', (el, value) => el.value = value, process.env.USERNAME);
        await page.$eval( '.btn', btn => btn.click() );
        await page.waitForNavigation();
        
        await page.waitForSelector('#password')
        await page.$eval('input[name=password]', (el, value) => el.value = value, process.env.PASSWORD);
        await page.$eval( '.btn', btn => btn.click() );
        await page.waitForNavigation();

        var rawDataids= fs.readFileSync('docIds.json');
        var rawDatacompleted= fs.readFileSync('completed.json');
        var completed = JSON.parse(rawDatacompleted);
        var oldIds = JSON.parse(rawDataids);
        var ids = oldIds.filter(e=>!completed.includes(e))
        for (id in ids){
            console.log(`${completed.length} completed out of${oldIds.length}`)
            rawDatacompleted= fs.readFileSync('completed.json');
            completed = JSON.parse(rawDatacompleted);
            let output = completed.concat(ids[id])
            await downloadDocument(page,ids[id])
            fs.writeFileSync('completed.json', JSON.stringify(output));
        }
    }
}
module.exports = scraperObject;