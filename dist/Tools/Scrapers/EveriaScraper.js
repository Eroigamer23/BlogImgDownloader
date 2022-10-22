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
exports.EveriaScraper = void 0;
const ImgDownloader_1 = require("../ImgDownloader");
const Types_1 = require("../Types");
const Utils_1 = require("../Utils");
const webscraper_1 = require("../webscraper");
const EveriaScraper = (scraper) => __awaiter(void 0, void 0, void 0, function* () {
    const page = yield scraper.Browser.newPage();
    yield page.setUserAgent("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36");
    //monitor requests
    yield page.setRequestInterception(true);
    //check resourceType is script
    page.on('request', (request) => {
        if (request.resourceType() === 'script')
            request.abort();
        else
            request.continue();
    });
    yield page.goto(scraper.URL, {
        waitUntil: 'networkidle2'
    });
    yield (0, webscraper_1.autoScroll)(page);
    let imgSrcs = [];
    imgSrcs = yield page.$$eval('figure > img', (as) => as.map((a) => a.src));
    if (imgSrcs.length < 1) {
        imgSrcs = yield page.$$eval('.entry-content > div  a', (as) => as.map((a) => decodeURI(a.href)));
    }
    if (imgSrcs.length > 0) {
        let title = yield page.evaluate(() => {
            const tag = document.querySelectorAll(".entry-title");
            const tag_array = Array.from(tag);
            return tag_array.map(title => title.textContent);
        });
        title = title.toString().replace('/', '-').trim();
        console.log(`Start downloading all Images from ${title}`);
        const folderDir = `${Types_1.TMP_FOLDER}/${title}`;
        const downloadProm = [];
        imgSrcs.forEach((src, idx) => downloadProm.push((0, ImgDownloader_1.ImgDownloader)(src, `${folderDir}/${(0, Utils_1.getImgName)(encodeURI(src))}`)));
        yield Promise.all(downloadProm);
        const zipPath = (0, Utils_1.createZipFile)(title, `./${folderDir}`);
        return { path: zipPath, filename: title, code: 200 };
    }
    else {
        return { error: 'Couldn not find any Images', code: 404 };
    }
});
exports.EveriaScraper = EveriaScraper;
