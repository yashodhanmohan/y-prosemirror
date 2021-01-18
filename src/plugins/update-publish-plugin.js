import { Plugin } from 'prosemirror-state' // eslint-disable-line
import { ySyncPluginKey } from './keys';

export const updatePublishPlugin = new Plugin({
  filterTransaction(transaction, state) {
    const change = transaction.getMeta(ySyncPluginKey);
    if(change === undefined || change.isChangeOrigin === false) {
      let steps = transaction.steps;
      for(let step of steps) {
        console.log((transaction.time, " ", JSON.stringify(step.toJSON()));
      }
    }
    return true;
  }
});