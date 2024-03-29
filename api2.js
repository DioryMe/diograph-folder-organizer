const folderPath = process.argv[2]

const { reducers } = require('./reducers')

const { readDiographJson } = require('./diograph-reader')
const { rootId, diograph } = readDiographJson(folderPath) ? readDiographJson(folderPath) : {}

function saveDiograph(updatedDiograph) {
  const fs = require('fs')
  const fileContent = {
    rootId: rootId,
    diograph: updatedDiograph
  }
  return fs.writeFileSync(`${folderPath}/diograph.json`, JSON.stringify(fileContent, null, 2))
}

function getDiory(id) {
  return diograph[id]
}

function createDiory(payload) {
  if (getDiory(payload.id)) {
    // Throws error if diory already exists!
    throw new Error(`Can't create, diory (id: ${payload.id}) already exists! Use updateDiory instead`)
  }
  return reducers.createDiory({ diograph }, { payload: { diory: payload } }).diograph
}

function updateDiory(payload) {
  return reducers.updateDiory({ diograph }, { payload: { diory: payload } }).diograph
}

function deleteDiory(payload) {
  return reducers.deleteDiory({ diograph }, { payload: { diory: payload } }).diograph
}

function createLink(fromDioryId, toDioryId) {
  return reducers.createLink(
    { diograph },
    {
      payload: {
        diory: { id: fromDioryId },
        link: { id: toDioryId }
      }
    }
  ).diograph
}

function deleteLink(fromDioryId, toDioryId) {
  return reducers.deleteLink(
    { diograph },
    {
      payload: {
        fromDiory: { id: fromDioryId },
        toDiory: { id: toDioryId }
      }
    }
  ).diograph
}


// const response = getDioryWithLinkedDiories("93b2f5e6-f135-4595-b0c2-3def18cc91bb")
// const response = getDioryWithLinkedAndReverseLinkedDiories("93b2f5e6-f135-4595-b0c2-3def18cc91bb")
// const response = createDiory({
//   id: "456-0213-4a91-855f-97ef03c2d261"
// })
// const response = deleteDiory({
//   id: "456-0213-4a91-855f-97ef03c2d261"
// })
// const response = createLink(
//   "456-0213-4a91-855f-97ef03c2d261",
//   "24d0239d-0213-4a91-855f-97ef03c2d261"
// )
// const response = deleteLink(
//   "456-0213-4a91-855f-97ef03c2d261",
//   "24d0239d-0213-4a91-855f-97ef03c2d261"
// )
// const response = deleteLink(
//   "24d0239d-0213-4a91-855f-97ef03c2d261",
//   "456-0213-4a91-855f-97ef03c2d261"
// )
const response = updateDiory({
  "id": "93b2f5e6-f135-4595-b0c2-3def18cc91bb",
  "text": "not-so-random-folder"
})
saveDiograph(response)
console.log(JSON.stringify(response, null, 4))

