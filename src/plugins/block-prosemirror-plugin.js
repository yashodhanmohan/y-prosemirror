const KeyBy = require('lodash/keyBy');

let constructedTreeForBlockId = {};
let blocksTraversed = {};

const Blocks = [{
  _id: 1,
  attrs: {},
  markups: {},
  parentId: 0,
  childrenIds: [2, 3, 4]
}, {
  _id: 2,
  attrs: {},
  markups: {},
  parentId: 1,
  childrenIds: [5, 6]
}, {
  _id: 3,
  attrs: {},
  markups: {},
  parentId: 1,
  childrenIds: []
}, {
  _id: 4,
  attrs: {},
  markups: {},
  parentId: 1,
  childrenIds: [7]
}, {
  _id: 5,
  attrs: {},
  markups: {},
  parentId: 2,
  childrenIds: [8, 9, 10]
},
{
  _id: 6,
  attrs: {},
  markups: {},
  parentId: 2,
  childrenIds: []
},
{
  _id: 7,
  attrs: {},
  markups: {},
  parentId: 4,
  childrenIds: []
},
{
  _id: 8,
  attrs: {},
  markups: {},
  parentId: 5,
  childrenIds: [11]
},
{
  _id: 9,
  attrs: {},
  markups: {},
  parentId: 5,
  childrenIds: []
},
{
  _id: 10,
  attrs: {},
  markups: {},
  parentId: 5,
  childrenIds: []
},
{
  _id: 11,
  attrs: {},
  markups: {},
  parentId: 8,
  childrenIds: [12]
},
{
  _id: 12,
  attrs: {},
  markups: {},
  parentId: 11,
  childrenIds: []
}
]

const setBlockTraversed = (blockId) => { blocksTraversed[blockId] = true; }
const isTreeAlreadyConstructed = (blockId) => !!constructedTreeForBlockId[blockId];
const isBlockAlreadyTraversed = (blockId) => blocksTraversed[blockId];
const isRootBlock = (block, blocksKeyedById) => !blocksKeyedById[block.parentId];
const doesBlockHaveDecoratedTexts = (block) => !block.decoratedText;

const getProseMirrorDocumentForABlock = (block) => ({
  type: block.blockType,
  attrs: { ychange: null, id: block._id, ...block.attributes },
  marks: block.markups,
  content: constructedTreeForBlockId[block._id]
})

const constructProseMirrorDocumentForBlock = (blockId, blocksKeyedById) => {
  setBlockTraversed(blockId);
  if (isTreeAlreadyConstructed(blockId)) {
    return getProseMirrorDocumentForABlock(blocksKeyedById[blockId]);
  }
  const block = blocksKeyedById[blockId];
  // Accumulating childNodes
  const children = [];
  for (let index = 0; index < block.childrenIds.length; index++) {
    const childrenId = block.childrenIds[index];
    children.push(constructProseMirrorDocumentForBlock(childrenId, blocksKeyedById));
  }
  if (children.length === 0 && doesBlockHaveDecoratedTexts(block)) {
    const parsedDecoratedText = JSON.parse(block.decoratedText);
    if (Array.isArray(parsedDecoratedText)) {
      children.push(...parsedDecoratedText);
    }
  }
  constructedTreeForBlockId[blockId] = children;
  return getProseMirrorDocumentForABlock(block);
}

function getProseMirrorDocument(blocks) {
  const blocksKeyedById = KeyBy(blocks, (block) => block._id);
  const blockIds = Object.keys(blocksKeyedById);
  constructedTreeForBlockId = {};
  let proseMirrorDocument;
  for (let outerIndex = 0; outerIndex < blockIds.length; outerIndex++) {
    const block = blocksKeyedById[blockIds[outerIndex]];
    if (isBlockAlreadyTraversed(block._id)) {
      continue;
    }
    // Accumulating childNodes
    const children = [];
    for (let innerIndex = 0; innerIndex < block.childrenIds.length; innerIndex++) {
      const childrenId = block.childrenIds[innerIndex];
      children.push(constructProseMirrorDocumentForBlock(childrenId, blocksKeyedById));
    }
    constructedTreeForBlockId[block._id] = children;
    if (isRootBlock(block, blocksKeyedById)) {
      proseMirrorDocument = getProseMirrorDocumentForABlock(block);
    }
  }
  console.log('proseMirrorDocument', JSON.stringify(proseMirrorDocument, null, 2));
}

console.log(getProseMirrorDocument(Blocks));