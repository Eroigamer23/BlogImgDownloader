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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webscraper_1 = __importDefault(require("./Tools/webscraper"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const Types_1 = require("./Tools/Types");
const fs = __importStar(require("fs"));
const listEndpoints = require('express-list-endpoints');
const PORT = 8000;
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.get('/everiaDownloader', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method != 'GET') {
        res.status(405).send('HTTP Method ' + req.method + ' not allowed');
        return;
    }
    try {
        let parsedUrl = req.query.url;
        if (!parsedUrl) {
            res.send({ status: 'Fail', msg: 'No URL Provided!' });
        }
        parsedUrl = encodeURI(parsedUrl);
        const response = yield (0, webscraper_1.default)(parsedUrl, Types_1.Website.Everia);
        if (response.code === 200) {
            return res.download(response.path, `${response.filename}.zip`, function (err) {
                if (err) {
                    console.log(err);
                }
                fs.unlink(response.path, function () {
                    console.log(`file deleted from ${response.path}`);
                });
            });
        }
        else {
            return res.status(response.code).send(response.error);
        }
    }
    catch (err) {
        // console.log(err)
        res.send({ status: "Fail", error: err });
    }
}));
app.get('/micmicidolDownloader', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.method != 'GET') {
        res.status(405).send('HTTP Method ' + req.method + ' not allowed');
        return;
    }
    try {
        let parsedUrl = req.query.url;
        if (!parsedUrl) {
            return res.send({ status: 'Fail', msg: 'No URL Provided!' });
        }
        parsedUrl = encodeURI(parsedUrl);
        const response = yield (0, webscraper_1.default)(parsedUrl, Types_1.Website.Micmicidol);
        return res.status(200).download(response.path, `${response.filename}`, function (err) {
            if (err) {
                console.log(err);
            }
            fs.unlink(response.path, function () {
                console.log(`file deleted from ${response.path}`);
            });
        });
    }
    catch (err) {
        // console.log(err)
        return res.send({ status: "Fail", error: err });
    }
}));
console.log(listEndpoints(app).map((entry) => `Running at http://localhost:${PORT}${entry['path']} `));
app.listen(PORT, () => console.log(`Listening Port:${PORT}`));
