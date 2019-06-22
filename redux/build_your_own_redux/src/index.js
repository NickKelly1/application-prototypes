import React from 'react';
import ReactDOM from 'react-dom';
import NoteAppContainer_v0 from './containers/NoteAppContainer_v0';

// https://zapier.com/engineering/how-to-build-redux/

export const ACTIONS = {
  CREATE_NOTE: 'CREATE_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  OPEN_NOTE: 'OPEN_NOTE',
  CLOSE_NOTE: 'CLOSE_NOTE',
};

const initialState = {
  nextNoteId: 1,
  notes: {}
};

// *****************************************
// Action handlers & reducer
// *****************************************
const handlers = {
  [ACTIONS.CREATE_NOTE]: (state, action) => {
    const id = state.nextNoteId;
    const newNote = { id, content: action.content };

    return {
    ...state,
    nextNoteId: id + 1,
    notes: {
        ...state.notes,
        [id]: newNote,
      }
    }
  },

  [ACTIONS.UPDATE_NOTE]: (state, action) => {
    const { id, content } = action;
    const editedNote = {
      ...state.notes[id],
      content
    };
    return {
      ...state,
      notes: {
        ...state.notes,
        [id]: editedNote,
      },
    };
  },

  [ACTIONS.OPEN_NOTE]: (state, action) => ({ ...state, openNoteId: action.id }),

  [ACTIONS.CLOSE_NOTE]: (state, action) => ({ ...state, openNoteId: null }),
};

const reducer = (state = initialState, action) => {
  if (action.type in handlers) return handlers[action.type](state, action);
  return state;
}

// *****************************************
// custom ways to move state
// *****************************************

// moving state example (1)
{
  const state0 = reducer(undefined, { type: ACTIONS.CREATE_NOTE, content: 'MY NOTE - 0' });
  const state1 = reducer(state0, { type: ACTIONS.UPDATE_NOTE, id: 1, content: 'Hello World! '});
  console.log(' 1 STATE ] - by keeping track of state:', state0);
  console.log(' 1 STATE ] - by keeping track of state:', state1);
}

// moving state example (2)
{
  const actions = [
    { type: ACTIONS.CREATE_NOTE, content: 'MY NOTE - 0' },
    { type: ACTIONS.UPDATE_NOTE, id: 1, content: 'Hello, World!!!!!!' }
  ];
  const state = actions.reduce(reducer, undefined);
  console.log(' 2 STATE ] - by keeping track of actions and reducing:', state);
}

// *****************************************
// store
// *****************************************

function validateAction(action) {
  if (!action || action instanceof Array || !(action instanceof Object)) throw new Error('Action must be an object!');
  if (action.type === undefined) throw new Error('Action must have a type!');
}

function createStore() {
  let state = undefined;
  const subscribers = [];
  const store = {
    dispatch: (action) => {
      validateAction(action);
      state = reducer(state, action);
      subscribers.forEach(handler => handler());
    },
    getState: () => state,
    subscribe: handler => {
      subscribers.push(handler);
      // return unsubscribe function
      return () => {
        const index = subscribers.indexOf(handler);
        if (index > 0)
          subscribers.splice(index, 1);
      }
    }
  };
  store.dispatch({ type: '@@redux/INIT' });
  return store;
};

// moving state example (3)
{
  const store = createStore(reducer);
  store.dispatch({ type: ACTIONS.CREATE_NOTE, content: 'MY NOTE - 0' });
  console.log(' 3 STATE ] - by using createStore', store.getState());
}


const store = createStore(reducer);
store.dispatch({ type: ACTIONS.CREATE_NOTE, content: 'MY NOTE - 0' });
store.dispatch({ type: ACTIONS.CREATE_NOTE, content: 'MY NOTE - 1' });
store.dispatch({ type: ACTIONS.CREATE_NOTE, content: 'MY NOTE - 2' });
store.dispatch({ type: ACTIONS.CREATE_NOTE, content: 'MY NOTE - 3' });
console.log(' 4 STATE ] - by using createStore', store.getState());


function renderApp() {
  ReactDOM.render(
    <NoteAppContainer_v0 store={store} />,
    document.getElementById('root')
  );
}

renderApp();