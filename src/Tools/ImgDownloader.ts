import * as fs from 'fs'
import Axios from 'axios'
import { getDir } from './Utils'

export const ImgDownloader = async(url:string, filepath:string) => {
    try{
        const response  = await Axios({
            url,
            method:'GET',
            responseType:'stream'
        })
        return new Promise((resolve:any, reject:any) => { 
            fs.mkdir(getDir(filepath), {recursive: true}, (err:any) => {
                if(err) return console.log(err)       

                response.data.pipe(fs.createWriteStream(filepath))
                .on('error', reject)
                .once('close', () => resolve(filepath))
            })
        })
    }catch(err){
        // console.log(err)
    }
}
