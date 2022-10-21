import { ImgDownloader } from "../ImgDownloader"
import { ScrapeData, TMP_FOLDER, Website } from "../Types"
import { createZipFile, getImgName } from "../Utils"
import { autoScroll } from "../webscraper"

export const EveriaScraper = async(scraper:ScrapeData) => {
    const page = await scraper.Browser.newPage()    
    await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");

    //monitor requests
    await page.setRequestInterception(true)
    //check resourceType is script
    page.on('request', (request:any) => {
    if (request.resourceType() === 'script')
        request.abort();
    else
        request.continue();
    })

    await page.goto(scraper.URL,{
        waitUntil:'networkidle2'
    });
    await autoScroll(page)
    let imgSrcs: any[] = []
    imgSrcs = await page.$$eval('figure > img', (as:any) => as.map((a:any) => a.src))

    if(imgSrcs.length < 1){
        imgSrcs = await page.$$eval('.entry-content > div  a', (as:any) => as.map((a:any) => decodeURI(a.href)))
    }

    if(imgSrcs.length > 0){
        let title:string|any = await page.evaluate(() => {
            const tag = document.querySelectorAll(".entry-title")
            const tag_array = Array.from(tag)
            return tag_array.map( title => title.textContent)
        })
        title = title.toString().replace('/','-').trim()
        console.log(`Start downloading all Images from ${title}`)
        const folderDir = `${TMP_FOLDER}/${title}`
        const downloadProm:any[] = []

        imgSrcs.forEach((src:string, idx:number) => downloadProm.push(ImgDownloader(src, `${folderDir}/${getImgName(encodeURI(src))}`)))
        await Promise.all(downloadProm)
        const zipPath:string =  createZipFile(title, `./${folderDir}`)

        return {path: zipPath, filename: title, code:200}
    }else{
        return {error:'Couldn not find any Images', code:404}
    }
}
