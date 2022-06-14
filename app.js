const path = require('path');
const os = require('os');
const fs = require('fs');
const { basename } = require('path');

// Get a folder name from a user and create a path of the folder
const folder = process.argv[2];
const workingDir = path.join(os.homedir(), 'Pictures', folder);

if (!folder || !fs.existsSync(workingDir)) {
    console.log('Please enter folder name in Pictures')
    return;
}

// Create 3 folders (video, captured, duplicated)
const videoDir = path.join(workingDir, 'video');
const capturedDir = path.join(workingDir, 'captured'); 
const duplicatedDir = path.join(workingDir, 'duplicated');

if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir);
}
if (!fs.existsSync(capturedDir)) {
    fs.mkdirSync(capturedDir);
}
if (!fs.existsSync(duplicatedDir)) {
    fs.mkdirSync(duplicatedDir);
}

// Read file names in the folder and move them to the video/captured/duplicated folder.
fs.promises
    .readdir(workingDir)
    .then(processFiles)
    .catch(console.log);

function processFiles(files) {
    files.forEach(file => {
        if (isVideoFile(file)) {
            moveFile(file, videoDir);
        } else if (isCapturedFile(file)) {
            moveFile(file, capturedDir);
        } else if (isDuplicatedFile(files, file)) {
            moveFile(file, duplicatedDir);
        }
    });
}

function isVideoFile(file) {
    const regex = /(mp4|mov)$/gm;
    const match = file.match(regex);
    return !!match;
}

function isCapturedFile(file) {
    const regex = /(png|aae)$/gm;
    const match = file.match(regex);
    return !!match;
}

function isDuplicatedFile(files, file) {
    if (!file.startsWith('IMG_') || file.startsWith('IMG_E')) {
        return;
    }

    const edited = `IMG_E${file.split('_')[1]}`;
    return files.includes(edited);
}

function moveFile(file, targetDir) {
    console.log(`moved ${file} to ${path.basename(targetDir)}`)
    const oldPath = path.join(workingDir, file)
    const newPath = path.join(targetDir, file);
    fs.promises
        .rename(oldPath, newPath)
        .catch(console.log)
}