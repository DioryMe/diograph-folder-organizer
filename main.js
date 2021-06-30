const { existsSync, lstatSync, promises, statSync } = require('fs')

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

const main = async function main() {
  try {
    const paths = await getFileAndSubfolderPaths(folderPath)
    console.log(paths)
  } catch(e) {
    console.log('ERROR:', e.message)
  }
}

main()

