const folderPath = process.argv[2]

const { readDiographJson } = require('./diograph-reader')
const { rootId, diograph } = readDiographJson(folderPath) ? readDiographJson(folderPath) : {}

function getDiory(id) {
  return diograph[id]
}

function getDioryWithLinkedDiories(id) {
  const diory = getDiory(id)
  diory.linkedDiories = Object.values(diory.links).map(({ id }) => diograph[id])
  return diory
}

function getDioryWithLinkedAndReverseLinkedDiories(id) {
  const diory = getDioryWithLinkedDiories(id)
  diory.reverseLinkedDiories = Object.values(diograph).filter(({ id: linkedDioryId, links }) => {
    return links ? Object.values(links).find(({ id: linkId }) => linkId == id) : false
  })
  return diory
}

function createDiory(payload) {
  // Throws error if diory already exists!
}

function updateDiory(payload) {
  // Throws error if diory doesn't already exist!
}

function deleteDiory(id, removeLinks = true) {

}

function createLink(fromDioryId, toDioryId) {

}

function deleteLink(fromDioryId, toDioryId) {

}


// const response = getDioryWithLinkedDiories("93b2f5e6-f135-4595-b0c2-3def18cc91bb")
const response = getDioryWithLinkedAndReverseLinkedDiories("93b2f5e6-f135-4595-b0c2-3def18cc91bb")
console.log(JSON.stringify(response, null, 4))

