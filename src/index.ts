import webscraper from "./Tools/webscraper"
import express from 'express'
import cors from 'cors'
import { Website } from "./Tools/Types"
import * as fs from 'fs'

const listEndpoints = require('express-list-endpoints')

const PORT = process.env.PORT || 8000 //Port
const app = express()
app.use(cors())

// app.get('/', (req:express.Request, res:express.Response) => {
//     try{
//         return res.send(listEndpoints(app).map((entry:any) => `API at http://localhost:${PORT}${entry['path']} `))
//     }catch(err){
//         return res.send(err)
//     }
// })

app.get('/everiaDownloader',  async(req:express.Request, res:express.Response) => {

    if (req.method != 'GET') {
        res.status(405).send( 'HTTP Method ' + req.method + ' not allowed');
        return;
    }

    try{
        let parsedUrl :any = req.query.url
        if(!parsedUrl){
            res.send({status:'Fail', msg: 'No URL Provided!'})
        }
        parsedUrl = encodeURI(parsedUrl)
        const response:any = await webscraper(parsedUrl, Website.Everia)
        if(response.code === 200){
            return res.download(response.path, `${response.filename}.zip`, function(err){
                if(err){
                    console.log(err)
                }
                fs.unlink(response.path,function() {
                    console.log(`file deleted from ${response.path}`)
                })
            })
        }else{
            return res.status(response.code).send(response.error)
        }
    }catch(err){
        // console.log(err)
        res.send({status:"Fail", error: err})
    }
})

app.get('/micmicidolDownloader',  async(req:express.Request, res:express.Response) => {

    if (req.method != 'GET') {
        res.status(405).send( 'HTTP Method ' + req.method + ' not allowed');
        return;
    }

    try{
        let parsedUrl:any = req.query.url
        if(!parsedUrl){
            return res.send({status:'Fail', msg: 'No URL Provided!'})
        }
        parsedUrl = encodeURI(parsedUrl)
        const response:any = await webscraper(parsedUrl, Website.Micmicidol)
        
        return res.status(200).download(response.path, `${response.filename}`, function(err){
            if(err){
                console.log(err)
            }
            fs.unlink(response.path,function() {
                console.log(`file deleted from ${response.path}`)
            })
        })
    }catch(err){
        // console.log(err)
       return res.send({status:"Fail", error: err})
    }
})

console.log(listEndpoints(app).map((entry:any) => `Running at http://localhost:${PORT}${entry['path']} `))

app.listen(PORT, () => console.log(`Listening Port:${PORT}`))