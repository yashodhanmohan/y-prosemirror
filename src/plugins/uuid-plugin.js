import { Plugin } from 'prosemirror-state' // eslint-disable-line
import { v4 as uuidv4 } from 'uuid';

export const uuidPlugin = new Plugin({
  appendTransaction: (transactions, prevState, nextState) => {
    
    // Create an empty transaction in case we want to make changes
    // to the state
    const tr = nextState.tr;
    
    // Save the current doc.
    const doc = nextState.doc;

    // Mark if the plugin made any changes to the state.
    let modified = false;

    let presentIDs = new Set();
    doc.descendants((node, pos, parent) => {
      
      // DO NOT TOUCH TEXT NODES
      if(node.type.isText) return;

      if(node.attrs.id) {
        // Detected a node with duplicate ID.
        // Change the ID.
        if(presentIDs.has(node.attrs.id)) {
          const newId = uuidv4();
          tr.setNodeMarkup(pos, node.type, { ...node.attrs, id: newId });
          presentIDs.add(newId);
          modified = true;
        } else {
          presentIDs.add(node.attrs.id);
        }
      } else {
        // Detected a node with no ID.
        // Give it a new ID.
        modified = true;
        tr.setNodeMarkup(pos, node.type, { ...node.attrs, id: uuidv4() });
      }
    });

    return modified ? tr : null;
  }
});