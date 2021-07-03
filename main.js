const { existsSync, lstatSync, promises, statSync } = require('fs')
const { isValid, isFile, isFolder, getPath } = require('./dirent-reader')
const fsPromises = require('fs/promises');
const path = require('path')
const { getDioryType } = require('./file-reader')
const { readDiographJson } = require('./diograph-reader')

const folderPath = process.argv[2]
const { rootId, diograph } = readDiographJson(folderPath) ? readDiographJson(folderPath) : {}

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

const getDestinationPaths = async function(filePath) {
  if (diograph) {
    const rootDioryLinks = Object.keys(diograph[rootId].links)
    const fileName = path.basename(filePath)
    if (rootDioryLinks.includes(fileName)) {
      const dioryId = diograph[rootId].links[fileName].id
      const diory = diograph[dioryId]
      if (diory.links) {
        const linkedDiories = Object.values(diory.links).map(({ id }) => {
          return diograph[id]
        })
        const destinationPaths = linkedDiories.map((linkedDiory) => {
          if (linkedDiory.data) {
            const type = linkedDiory.data[0]['@type']
            console.log('type', type)
            console.log('diory.text', linkedDiory.text)
            return path.join(__dirname, 'tmp', type, linkedDiory.text)
          }
        })
        return destinationPaths.filter(Boolean)
      }
    }
  }
  return getDioryType(filePath).then((dioryType) => {
    const destinationPath = path.join(__dirname, 'tmp', dioryType)
    console.log('diorytype destination', destinationPath)
    return [destinationPath]
  })
}

const copyFiles = async ({ filePaths }) => {
  return Promise.all(
    filePaths.map((filePath) => {
      return getDestinationPaths(filePath).then((destinationPaths) => {
        if (destinationPaths.length < 1) {
          return
        }
        const destinationPath = destinationPaths[0]
        console.log('path', destinationPath)
        if (!existsSync(destinationPath)) {
          fsPromises.mkdir(destinationPath)
        }
        console.log(filePath)
        console.log('=============>', path.join(destinationPath, path.basename(filePath)))
        return fsPromises.copyFile(filePath, path.join(destinationPath, path.basename(filePath)))
      })
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
  // try {
    await resetTempFolder()
    const paths = await getFileAndSubfolderPaths(folderPath)
    console.log(paths)
    await copyFiles(paths)
  // } catch(e) {
  //   console.log('ERROR:', e.message)
  // }
}

main()
