function validateAction(action) {
  if (!(action instanceof Object) || typeof action.type !== 'string')
    throw new Error('Invalid action.');
}

export default validateAction;