const AdmZip =  require('adm-zip')
import * as fs from 'fs'
import { TMP_FOLDER, ZIP_FOLDER } from './Types'
// import * as AdmZip from 'adm-zip'

export const getImgName = (url:string) => {
    const urllast = url.lastIndexOf('/') === url.length ? url.slice(0, url.lastIndexOf('/')): url
    const trimAfter = url.lastIndexOf("/") > -1 ? url.lastIndexOf("/") : 0
    const imgName = url.slice(trimAfter + 1)
    return imgName 
}

export const getDir = (filepath:string) => {
    const trimAfter = filepath.lastIndexOf("/") > -1 ? filepath.lastIndexOf("/") : 0
    const dirName = filepath.slice(0,trimAfter)
    return dirName 
}

export const createZipFile = (filename:string, dir:string) => {
    try{
        const zip = new AdmZip()
        const output:string = `${ZIP_FOLDER}/${filename}.zip`
        zip.addLocalFolder(dir)
        zip.writeZip(output)
        fs.rmSync(`${TMP_FOLDER}/${filename}`,{recursive:true, force:true})
        console.log(`Created ${output} successfully!`)
        return output
    }catch(err){
        console.log(err)
        return ''
    }
}

export const cleanUpDownload = (path:string) => {
    fs.unlinkSync(path)
}