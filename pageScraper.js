const { DH_NOT_SUITABLE_GENERATOR } = require('constants');

const scraperObject = {
    url: 'http://docusign.net',
    async scraper(browser){
        const fs = require('fs');
        const readline = require('readline');
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        await page.goto(this.url);
        await page.waitForSelector('#username')
        await page.$eval('input[name=email]', (el, value) => el.value = value, process.env.USERNAME);
        await page.$eval( '.btn', btn => btn.click() );
        await page.waitForNavigation();
        //submit pw
        await page.waitForSelector('#password')
        await page.$eval('input[name=password]', (el, value) => el.value = value, process.env.PASSWORD);
        await page.$eval( '.btn', btn => btn.click() );
        await page.waitForNavigation();
        let nexturl = "https://app.docusign.com/documents?view=sent"
        console.log(`Navigating to ${nexturl}...`);
        await page.goto(nexturl);
        //now scroll all the way to bottom
        await page.waitForSelector('tbody > tr')

        function askQuestion(query) {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
            });
        
            return new Promise(resolve => rl.question(query, ans => {
                rl.close();
                resolve(ans);
            }))
        }

        
        //const ans = await askQuestion("ready?");
        //console.log(ans)

        await getIds();
        page.evaluate(()=>{
            const targetNode = document
            const config = { attributes: true, childList: true, subtree: true };
            let timedout = true

        const callback = function(mutationsList, observer) {
            if (timedout){
                console.log('test')
                timedout= false
            }
            
            setTimeout(x=>{
                timedout = true
            },50)
            
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
        })
        page.on('console', async()=>{
            await getIds()
        })

        async function getIds(){
            const trs = await page.$$eval('tbody > tr',trs=>{
                trs = trs.map(x=>x.attributes[0].textContent.slice(26,-18))
                return trs
            })
            
            var rawData= fs.readFileSync('docIds.json');
            var oldArray = JSON.parse(rawData);
            var newTrs = trs.filter(id=>!oldArray.includes(id))

            if(newTrs[0]){
            console.log('new ids added to file:')
            console.log (newTrs)
            }
            let output = oldArray.concat(newTrs)
            fs.writeFileSync('docIds.json', JSON.stringify(output));
            //logg = await logg.jsonValue()
        }
    }   
}

module.exports = scraperObject;