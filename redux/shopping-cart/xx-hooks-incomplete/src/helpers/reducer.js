import validateAction from "./validateAction";

function reducer(handlers) {
  return function(state, action) {
    validateAction(action);
    if (action.type in handlers) return handlers[action.type](state, action);
    else throw new Error(`Invalid action type: ${action.type}`);
  }
}

export default reducer;