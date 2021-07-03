const FileType = require('file-type')

exports.getDioryType = async function getDioryType(filePath) {
  const fileType = await FileType.fromFile(filePath)
  if (!fileType || !fileType.mime) {
    return 'DigitalDocument'
  }

  const type = fileType.mime.split('/')[0]
  switch (type) {
    case 'image':
      return 'ImageObject'
    case 'video':
      return 'VideoObject'
    case 'audio':
      return 'AudioObject'
    // case 'application':
    // case 'text':
    default:
  }

  return 'DigitalDocument'
}
