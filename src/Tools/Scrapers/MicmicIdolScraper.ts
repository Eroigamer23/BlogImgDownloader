import { ImgDownloader } from "../ImgDownloader"
import { ScrapeData, TMP_FOLDER, Website } from "../Types"
import { createZipFile, getImgName } from "../Utils"
import { autoScroll } from "../webscraper"

export const MicmicIdolScraper = async(scraper:ScrapeData) => {
  const page = await scraper.Browser.newPage()   
  await page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
  
  page.on('dialog', async (dialog:any) => {
      //get alert message
      console.log(dialog.message());
      //accept alert
      await dialog.accept();
  }) 

  await page.goto(scraper.URL,{
    waitUntil:'networkidle2'
  });

  await autoScroll(page)
  const imgSrcs = await page.$$eval('.entry-content > a', (as:any) => as.map((a:any) => a.href))

  let title:string|any = await page.evaluate(() => {
      const tag = document.querySelectorAll(".entry-title")
      const tag_array = Array.from(tag)
      return tag_array.map( title => title.textContent)
  })
  title = title.toString().replace('/','-').trim()
  console.log(`Start downloading all Images from ${title}`)
  const folderDir = `${TMP_FOLDER}/${title}`
  const downloadProm:any[] = []

  imgSrcs.forEach((src:string, idx:number) => downloadProm.push(ImgDownloader(src, `${folderDir}/${getImgName(src)}`)))
  await Promise.all(downloadProm)
  const zipPath:string =  createZipFile(title, `./${folderDir}`)

  return {path: zipPath, filename: title, code:200}
}
