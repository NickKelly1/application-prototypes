import { createStore } from './store';
import { Reducer } from './store.types';

interface TestState {
  year: number;
  actors: { name: string; isAlive: boolean; isInPrison: boolean; age: number }[];
}

const TEST_ACTION_NAMES = {
  ATTACK: 'ATTACK' as const,
  INCREMENT_YEAR: 'INCREMENT_YEAR' as const,
};
type TEST_ACTION_NAMES = typeof TEST_ACTION_NAMES;

type TestActionTypes =
  | {
      type: TEST_ACTION_NAMES['ATTACK'];
      payload: { attacker: string; victim: string };
    }
  | {
      type: TEST_ACTION_NAMES['INCREMENT_YEAR'];
      payload: { byAmount: number };
    };

const testReducer: Reducer<TestState, TestActionTypes> = (state, action) => {
  switch (action.type) {
    case TEST_ACTION_NAMES.ATTACK:
      return {
        ...state,
        actors: state.actors.map(actor => {
          if (actor.name === action.payload.victim) return { ...actor, isAlive: false };
          if (actor.name === action.payload.attacker) return { ...actor, isInPrison: true };
          return actor;
        }),
      };

    // TODO: increment actors age...
    case TEST_ACTION_NAMES.INCREMENT_YEAR:
      return {
        ...state,
        year: state.year += action.payload.byAmount,
      };

    default:
      return state;
  }
};

const setup = () => {
  const initialState: TestState = {
    year: 2019,
    actors: [
      {
        name: 'Tom Cruise',
        isAlive: true,
        isInPrison: false,
        age: 75,
      },
      {
        name: 'Henry Cavill',
        isAlive: true,
        isInPrison: false,
        age: 30,
      },
    ],
  };

  const store = createStore<TestState, TestActionTypes>(initialState, [testReducer]);

  return {
    initialState,
    store,
  };
};

describe('Store', () => {
  it('should get the initial state', () => {
    const { initialState, store } = setup();

    expect(store.getState()).toBe(initialState);
  });

  it('should immutably update state when an action is fired', () => {
    const { initialState, store } = setup();

    // change year and assert success
    store.dispatch({ type: TEST_ACTION_NAMES.INCREMENT_YEAR, payload: { byAmount: 5 } });
    // store immutably changed
    expect(store.getState()).not.toBe(initialState);
    // year changed
    expect(store.getState().year).toBe(initialState.year + 5);
    // actors did not lose reference
    expect(store.getState().actors).toBe(initialState.actors);

    // change actors and assert immutable change
    const previousActors = store.getState().actors;
    if (previousActors.length < 2) throw new Error('This test requires at least 2 actors...');
    const victim = previousActors[0].name;
    const attacker = previousActors[1].name;
    store.dispatch({ type: TEST_ACTION_NAMES.ATTACK, payload: { attacker, victim } });

    // actors immutably changed
    expect(previousActors).not.toBe(store.getState().actors);

    // actors updated accordingly
    const deadVictim = store.getState().actors.find(actor => actor.name === victim);
    const imprisonedAttacker = store.getState().actors.find(actor => actor.name === attacker);
    expect(deadVictim).not.toBeUndefined();
    expect(imprisonedAttacker).not.toBeUndefined();
    if (deadVictim === undefined || imprisonedAttacker === undefined) throw new Error('Test failed - cannot continue');
    expect(deadVictim.isAlive).toBe(false);
    expect(imprisonedAttacker.isInPrison).toBe(true);
  });
});
