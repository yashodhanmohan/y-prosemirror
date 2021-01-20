import { Plugin } from 'prosemirror-state' // eslint-disable-line
import { v4 as uuidv4 } from 'uuid';

export const updatePublishPlugin = new Plugin({
  appendTransaction: (transactions, prevState, nextState) => {
    const tr = nextState.tr;
    let modified = false;

    transactions.forEach(transaction => {
      transaction.steps.forEach(step => {
        console.log('Step: ', nextState.doc.nodeAt(step.from));
      })
    })

    nextState.doc.descendants((node, pos, parent) => {
      if(node.attrs.id === null && !node.type.isText) {
        modified = true;
        tr.setNodeMarkup(pos, node.type, { ...node.attrs, id: uuidv4() });
      }
    })

    return modified ? tr : null;
  }
});