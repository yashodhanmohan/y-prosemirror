import { Plugin } from 'prosemirror-state' // eslint-disable-line
import { v4 as uuidv4 } from 'uuid';

export const updatePublishPlugin = new Plugin({
  appendTransaction: (transactions, prevState, nextState) => {
    const tr = nextState.tr;
    let modified = false;

    transactions.forEach(transaction => {
      const idsMap = {};
      nextState.doc.descendants((node, pos, parent) => {
        try {
          if (transaction.steps.length > 0 && transaction.steps[0].slice.content["content"].length > 0 && transaction.steps[0].slice.content["content"][0].attrs === node.attrs) {
            console.log(pos);
          }
        } catch (error) {
          console.error(error)
        }
      })
      transaction.steps.forEach(step => {
        console.log('Step: ', nextState.doc.nodeAt(step.from));
      })
    })

    nextState.doc.descendants((node, pos, parent) => {
      if (!node.type.isText && !node.attrs.id) {
        modified = true;
        tr.setNodeMarkup(pos, node.type, { ...node.attrs, id: uuidv4() });
      }
    })

    return modified ? tr : null;
  }
});