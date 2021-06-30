const { existsSync, lstatSync, promises, statSync } = require('fs')
const { isValid, isFile, isFolder, getPath } = require('./dirent-reader')
const fsPromises = require('fs/promises');
const path = require('path')

const folderPath = process.argv[2]

const getFileAndSubfolderPaths = async function getFileAndSubfolderPaths(folderPath) {
  if (!(existsSync(folderPath) && lstatSync(folderPath).isDirectory())) {
    throw new Error(`Path is not folder ${folderPath}`)
  }
  const dirents = await promises.readdir(folderPath, { withFileTypes: true })
  return {
    filePaths: dirents.filter(isFile).filter(isValid).map(getPath(folderPath)),
    subfolderPaths: dirents.filter(isFolder).filter(isValid).map(getPath(folderPath)),
  }
}

const resetTempFolder = () => {
  const tempFolderPath = path.join(__dirname, 'tmp')
  // fsPromises.rm(tempFolderPath, { recursive: true, force: true })
  // fsPromises.mkdir(tempFolderPath)
  console.log(tempFolderPath)
}

const main = async function main() {
  try {
    const paths = await getFileAndSubfolderPaths(folderPath)
    console.log(paths)
    resetTempFolder()

  } catch(e) {
    console.log('ERROR:', e.message)
  }
}

main()



