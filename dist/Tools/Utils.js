"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUpDownload = exports.createZipFile = exports.getDir = exports.getImgName = void 0;
const AdmZip = require('adm-zip');
const fs = __importStar(require("fs"));
const Types_1 = require("./Types");
// import * as AdmZip from 'adm-zip'
const getImgName = (url) => {
    const urllast = url.lastIndexOf('/') === url.length ? url.slice(0, url.lastIndexOf('/')) : url;
    const trimAfter = url.lastIndexOf("/") > -1 ? url.lastIndexOf("/") : 0;
    const imgName = url.slice(trimAfter + 1);
    return imgName;
};
exports.getImgName = getImgName;
const getDir = (filepath) => {
    const trimAfter = filepath.lastIndexOf("/") > -1 ? filepath.lastIndexOf("/") : 0;
    const dirName = filepath.slice(0, trimAfter);
    return dirName;
};
exports.getDir = getDir;
const createZipFile = (filename, dir) => {
    try {
        const zip = new AdmZip();
        const output = `${Types_1.ZIP_FOLDER}/${filename}.zip`;
        zip.addLocalFolder(dir);
        zip.writeZip(output);
        fs.rmSync(`${Types_1.TMP_FOLDER}/${filename}`, { recursive: true, force: true });
        console.log(`Created ${output} successfully!`);
        return output;
    }
    catch (err) {
        console.log(err);
        return '';
    }
};
exports.createZipFile = createZipFile;
const cleanUpDownload = (path) => {
    fs.unlinkSync(path);
};
exports.cleanUpDownload = cleanUpDownload;
