import { Browser } from "puppeteer-core"
import { EveriaScraper } from "./Scrapers/EveriaScraper"
import { MicmicIdolScraper } from "./Scrapers/MicmicIdolScraper"
import { ScrapeData, Website } from "./Types"

const puppeteer = require('puppeteer-extra')
const { scrollPageToBottom } = require('puppeteer-autoscroll-down')

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())

// Add adblocker plugin, which will transparently block ads in all pages you
// create using puppeteer.
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer')
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker')
puppeteer.use(
  AdblockerPlugin({
    // Optionally enable Cooperative Mode for several request interceptors
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
  })
)

const webscraper =  async(url:string, site:string) => {
// puppeteer usage as normal
const browser:Browser = await puppeteer.launch({ 
    headless: true,
    ignoreHTTPSErrors:true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"] 
 })
    console.log('Starting tool at', decodeURI(url))
    const scrapeData : ScrapeData  = {URL:url, Browser:browser,Website:site} 
    const imgSrc = await scrapePage(scrapeData)

    console.log("Downloaded all Images ✨")

    await browser.close()
    return imgSrc
}

const scrapePage = async(scraper:ScrapeData) => {
    if(scraper.Website === Website.Everia){
      return await EveriaScraper(scraper)
    }
    if(scraper.Website === Website.Micmicidol){
      return await MicmicIdolScraper(scraper)
    }
}

export const autoScroll = async(page:any) => {
    const lastPosition = await scrollPageToBottom(page, {
        size: 500,
        delay: 100
      })
    return lastPosition
}

export default webscraper