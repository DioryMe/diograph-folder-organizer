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

const copyFiles = async ({ filePaths }) => {
  const destinationPath = path.join(__dirname, 'tmp', 'ImageObject')
  if (!existsSync(destinationPath)) {
    fsPromises.mkdir(destinationPath)
  }
  return Promise.all(
    filePaths.map((filePath) => {
      console.log(filePath)
      console.log('->', path.join(destinationPath, path.basename(filePath)))
      return fsPromises.copyFile(filePath, path.join(destinationPath, path.basename(filePath)))
    })
  )
}

const resetTempFolder = async () => {
  const tempFolderPath = path.join(__dirname, 'tmp')
  if (existsSync(tempFolderPath)) {
    await fsPromises.rm(tempFolderPath, { recursive: true, force: true })
  }
  await fsPromises.mkdir(tempFolderPath)
  console.log('TempFolderPath:', tempFolderPath)
}

const main = async function main() {
  try {
    await resetTempFolder()
    const paths = await getFileAndSubfolderPaths(folderPath)
    console.log(paths)
    await copyFiles(paths)
  } catch(e) {
    console.log('ERROR:', e.message)
  }
}

main()
