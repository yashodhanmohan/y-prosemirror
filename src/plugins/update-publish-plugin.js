import { Plugin } from 'prosemirror-state' // eslint-disable-line
import { v4 as uuidv4 } from 'uuid';

export const updatePublishPlugin = new Plugin({
  appendTransaction: (transactions, prevState, nextState) => {
    const tr = nextState.tr;
    let modified = false;

    console.group()
    nextState.doc.descendants((node, pos, parent) => {
      console.group()
      console.log((node));
      console.log((node.attrs));
      console.log((node.attrs.id));
      console.log((node.type));
      if(!node.attrs.id && !node.type.isText) {
        modified = true;
        tr.setNodeMarkup(pos, node.type, { ...node.attrs, id: uuidv4() });
      }
      console.groupEnd()
    })
    console.groupEnd()

    return modified ? tr : null;
  }
});