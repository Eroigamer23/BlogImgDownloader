"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autoScroll = void 0;
const EveriaScraper_1 = require("./Scrapers/EveriaScraper");
const MicmicIdolScraper_1 = require("./Scrapers/MicmicIdolScraper");
const Types_1 = require("./Types");
const puppeteer = require('puppeteer-extra');
const { scrollPageToBottom } = require('puppeteer-autoscroll-down');
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
// Add adblocker plugin, which will transparently block ads in all pages you
// create using puppeteer.
const { DEFAULT_INTERCEPT_RESOLUTION_PRIORITY } = require('puppeteer');
const AdblockerPlugin = require('puppeteer-extra-plugin-adblocker');
puppeteer.use(AdblockerPlugin({
    // Optionally enable Cooperative Mode for several request interceptors
    interceptResolutionPriority: DEFAULT_INTERCEPT_RESOLUTION_PRIORITY
}));
const webscraper = (url, site) => __awaiter(void 0, void 0, void 0, function* () {
    // puppeteer usage as normal
    const browser = yield puppeteer.launch({
        headless: true,
        ignoreHTTPSErrors: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    console.log('Starting tool at', decodeURI(url));
    const scrapeData = { URL: url, Browser: browser, Website: site };
    const imgSrc = yield scrapePage(scrapeData);
    console.log("Downloaded all Images ✨");
    yield browser.close();
    return imgSrc;
});
const scrapePage = (scraper) => __awaiter(void 0, void 0, void 0, function* () {
    if (scraper.Website === Types_1.Website.Everia) {
        return yield (0, EveriaScraper_1.EveriaScraper)(scraper);
    }
    if (scraper.Website === Types_1.Website.Micmicidol) {
        return yield (0, MicmicIdolScraper_1.MicmicIdolScraper)(scraper);
    }
});
const autoScroll = (page) => __awaiter(void 0, void 0, void 0, function* () {
    const lastPosition = yield scrollPageToBottom(page, {
        size: 500,
        delay: 100
    });
    return lastPosition;
});
exports.autoScroll = autoScroll;
exports.default = webscraper;
