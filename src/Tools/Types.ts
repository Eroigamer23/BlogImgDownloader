import { type } from "os"
import { Browser } from "puppeteer-core"

export const TMP_FOLDER = 'tmp'
export const ZIP_FOLDER = 'zip'
export const Website =  {
    "Everia": "Everia",
    "Micmicidol": "Micmicidol",
    "Insta":"Instagram",
}

export type ScrapeData = {
    URL:string,
    Browser: Browser,
    Website:string
}