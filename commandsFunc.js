import { resolve, normalize } from 'path';
import fs from 'fs'
import * as path from "path";
import * as url from "url";
import os from 'os'
import crypto from "crypto";
import * as zlib from "zlib";

function getCurrentDirectory(){
    console.log(`You are currently in ${process.cwd()}`)
    return process.cwd()
}

export  function goUpper   (){
    const currentPath = process.cwd();
    const parentPath = normalize(resolve(currentPath, '..'));
    if (parentPath !== currentPath) {
        try {
            getCurrentDirectory()
        }catch (error) {
            console.log('Operation failed:', error.message);
        }
    } else {
        console.log('Invalid input. Cannot go upper than root directory.');
    }
}

export function changeCurrentDirectory (arg){
    if(arg){
        process.chdir(arg)
        getCurrentDirectory()
    }
}


export   function listDirectoryFiles (){
    let  directory = getCurrentDirectory()
    let result=  []
    fs.stat(directory,(err, stats)=>{
        if(stats.isFile()){
            console.log("You are in the File")
        }else{
            fs.readdir(directory,{ withFileTypes: true }, async (err, data) => {
                for (let i = 0; i < data.length; i++) {
                    result.push({
                        index: i, name: data[i].name,
                        Type: stats.isDirectory() ? "File" : "Directory"
                    })
                }
                // Loop through the files and print their names
                console.log(result, "RESULT")
            })
        }
    })

}



export async function readFileContent(pathOfTheFile) {

    try {
        const stats = await fs.promises.stat(pathOfTheFile);
        if (stats.isFile()) {
            // If it's a file, create a readable stream and log the content
            const read = fs.createReadStream(pathOfTheFile);
            read.on('data', (chunk) => {
                console.log(chunk.toString('utf8'));
            });
        } else if (stats.isDirectory()) {
            console.log("According to your command you are in the Directory" +
                "type file using cat command")
            // If it's a directory, read the directory and log the files
                const files = await fs.promises.readdir(pathOfTheFile);
                for (let i = 0; i < files.length; i++) {
                    console.log(files[i])
                    const __filename = url.fileURLToPath(import.meta.url)
                    const __dirname = path.dirname(__filename)
                    const fileOfTheDirToRead  = path.join(__dirname, pathOfTheFile,files[i] )
                     const readme = fs.createReadStream(fileOfTheDirToRead)
                    readme.on("data", (data)=>{
                        console.log(data.toString())
                    })
                }
        } else {
            console.log('The path is neither a file nor a directory.');
        }
    } catch (error) {
        console.error(`Error processing path: ${error.message}`);
    }
}

export async function createNewFile(filePath) {
    try {
        const __filename = url.fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const fileOfTheDirToRead = path.join(__dirname, ...filePath);

        // Write the content to the file and create folder
        await fs.writeFile(fileOfTheDirToRead, "I am new One", (err)=>{
            if(err){
                console.log(err, 'err')
            }
        });

        console.log(`File "${fileOfTheDirToRead}" created successfully.`);
    } catch (error) {
        console.error(`Error creating file: ${error.message}`);
    }
}


export function  reName (path){
    fs.rename(path[0], path[1] ,(err)=>{
        console.log("Successfully renamed")
    })
}


 export async function  copyFile (arg_one, arg_two){
     await fs.copyFile(arg_one, arg_two, (err)=>{
         console.log("Successfully copied")
     });
}

export async function moveFile(arg_one, arg_two) {
    try {
        const __filename = url.fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const previousFile = path.join(__dirname, arg_one);
        const destinationFile = path.join(__dirname, arg_two);
        // Move the file
        await fs.promises.rename(previousFile, destinationFile);
        console.log(`File "${previousFile}" moved to "${destinationFile}" successfully.`);
        // Now, you can safely delete the source file
        await fs.promises.unlink(previousFile);
        console.log(`Previous file "${previousFile}" deleted.`);
    } catch (error) {
        console.error(`Error moving file: ${error.message}`);
    }
}

export async function deleteFile (arg){
    console.log(arg, 'arg')
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const file = path.join(__dirname, arg);
    await fs.promises.unlink(file);
}

export function osCommandOperators (arg) {
    switch (arg[0]){
        case "--EOL":
            console.log(`System End-Of-Line (EOL): ${JSON.stringify(os.EOL)} `);
            break
        case "--cpus":
            const cpus = os.cpus();
            cpus.forEach((item)=>{
                console.log(item.model)
                console.log(item.speed)
            })
            break
        case "--homedir":
            console.log(os.homedir())
            break
        case "--username":
            console.log(os.userInfo().username)
            break
        case '--architecture':
            console.log(process.arch)
    }

}
export function calculateHash(arg){
    const sha256Hash = crypto.createHash('sha256');
    const readableStream = fs.createReadStream(arg)
    readableStream.on("data", (chunk)=>{
        sha256Hash.update(chunk)
    })
    readableStream.on('end', ()=>{
        let hexData =    sha256Hash.digest("hex")
        console.log(hexData, "hexData")
    })
}

export function compressFile (arg){
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const originalFile = path.join(__dirname,arg);
    const compressedFile = path.join(__dirname, "compressed.br");
    const readStream = fs.createReadStream(originalFile);
 // Create a writable stream for the compressed output file
    const writeStream = fs.createWriteStream(compressedFile);
    const brotliStream = zlib.createBrotliCompress();
    readStream.pipe(brotliStream).pipe(writeStream);
    console.log("File has already compressed")

}
export function deCompressFile (arg_one, arg_two){
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const compressedFile = path.join(__dirname,arg_one);
    const decompressedFile = path.join(__dirname, arg_two);
   // Create a readable stream from the compressed file
    const readStream = fs.createReadStream(compressedFile)
    // Create a writable stream for the decompressed output file
    const writeStream = fs.createWriteStream(decompressedFile);

// Create a Brotli decompression stream
    const brotliStream = zlib.createBrotliDecompress();

// Pipe the compressed file stream through the Brotli decompression stream to the output file stream
    readStream.pipe(brotliStream).pipe(writeStream);

}