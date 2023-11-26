import * as repl from 'repl'

import readline from 'readline'

import {
    calculateHash,
    changeCurrentDirectory, compressFile, copyFile,
    createNewFile, deCompressFile, deleteFile,
    goUpper,
    listDirectoryFiles, moveFile, osCommandOperators,
    readFileContent,
    reName
} from "./commandsFunc.js";
//  terminal arguments
const cliArgs = process.argv.slice(2)
//  split the args to get the username
const userName = cliArgs.map(str => str.split('=')).flat();
//  says welcome to the user

console.log(`Welcome to the File Manager,${userName[1]}!`)

//  start the REPL
const replServer  = repl.start('> ');

// Listen for the exit event when the user types .exit
replServer.on('exit', () => {
    process.stdout.write(`Thank you for using File Manager, ${userName[1]}, goodbye!`)
});

console.log(process.cwd())





const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
});
rl.prompt();
// Function to handle each line of input
function handleInput(line) {
    const trimmedLine = line.trim();
    console.log(`Received input: ${trimmedLine}`);
}

// Listen for the 'line' event, which is emitted when the user presses Enter
rl.on('line', (input) => {

    const [command, ...args] = input.split(' ');
    switch (command) {
        case 'up':
            goUpper();
            break;
        case 'cd':
            changeCurrentDirectory(args[0]);
            break;
        case 'ls':
            listDirectoryFiles();
            break;
        case 'cat':
            console.log(args)
            readFileContent(args.toString())
            break;
        case 'add':
            createNewFile(args);
            break;
        case 'rn':
            reName(args);
            break;
        case 'cp':
            copyFile(args[0], args[1]);
            break;
        case 'mv':
            movemvFile(args[0], args[1]);
            break;
        case 'rm':
            deleteFile(args[0]);
            break;
        case 'os':
            osCommandOperators(args);
            break;
        case 'hash':
            calculateHash(args[0]);
            break;
        case 'compress':
            compressFile(args[0]);
            break;
        case 'decompress':
            deCompressFile(args[0], args[1]);
            break;
            default:
            console.log('Invalid input. Please enter a valid command.');
    }

});








