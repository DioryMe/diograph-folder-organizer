const fs = require('fs')

exports.readDiographJson = function readDiographJson(folderPath) {
  const diographJsonPath = `${folderPath}/diograph.json`

  if (fs.existsSync(diographJsonPath)) {
    const raw = fs.readFileSync(diographJsonPath)
    const { rootId, diograph } = JSON.parse(raw)
    return { rootId, diograph }
  }

  return undefined
}
