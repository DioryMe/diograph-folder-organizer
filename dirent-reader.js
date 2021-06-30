const { resolve } = require('path')

const ignoredFiles = ['diograph.json', 'Icon', 'Thumbs.db']

exports.isValid = function isValid(dirent) {
  return !(ignoredFiles.includes(dirent.name) || isHiddenFile(dirent.name))
}

function isHiddenFile(filename) {
  return /^\./.test(filename)
}

exports.isFile = function isFile(dirent) {
  return dirent.isFile()
}

exports.isFolder = function isFolder(dirent) {
  return dirent.isDirectory()
}

exports.getPath = function getPath(folderPath) {
  return (dirent) => resolve(folderPath, dirent.name)
}
