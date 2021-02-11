exports.downloadDocument =async function (page,id){
    const fs = require('fs');
    
    const chokidar = require('chokidar');
    let detailPrefix = 'https://app.docusign.com/documents/details/'
    await download(page, id)
        
    async function download(page,id){
        
        
        await page.goto(`${detailPrefix}${id}`);
        
        await page.waitForSelector('button[data-qa="document-download"]')
        await page.waitForSelector('span[data-qa="recipient-name"]')
        await page.$eval( 'button[data-qa="document-download"]', btn => btn.click() );
        await page.waitForSelector('#required-toggle-')
        await page.$eval( '#required-toggle-', check => {
            check.checked = true;
            check.click()
            check.click()
        });
        
        await page.$eval('.modal_footer > a', downloadLink=>{
            downloadLink.setAttribute('download',`testname`)
            downloadLink.click()
        })
        const downloads = process.env.DOWNLOADS
        var file
        const watcher = chokidar.watch(downloads,{
            ignored: /(^|[\/\\])\../, // ignore dotfiles
            persistent: true
          });

        file = await new Promise(async function(resolve,reject){
            var change
            watcher.on('change', async function(path){
                change = true
                setTimeout(() => {
                    change = false
                }, 2000);

                await setTimeout(x=>{
                    if (change = false){
                        resolve(path)
                    }
                }, 4000)
                if (path.includes('.pdf')){
                    resolve(path)
                }
            })
            
        })
        let newName = await page.$eval('span[data-qa="recipient-name"]',x=>x.innerText)
        newName = `${newName}_${id}`
        newName = newName.replace('.','_')//replace periods with underscores
        await fs.rename(file, `${downloads}/renamed/${newName}.pdf`, function(err) {
            if ( err ) console.log('ERROR: ' + err);
        });
        await page.goto('about:blank')
        
        
    }
}