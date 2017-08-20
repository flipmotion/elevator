import { inc, dec } from 'ramda';

import {
  ADD_FLOOR,
  TOGGLE_CALL,
  TOGGLE_ANSWER,
  SET_FLOOR_STATUS,
  SET_ELEVATOR_STATUS,
  SET_ELEVATOR_POSITION,
  ADD_ELEVATOR,
  ELEVATOR_STATUS,
  ELEVATORS_COUNT,
  FLOORS_COUNT,
} from '../constants';

export const FLOOR_INITIAL_STATE = {
  isCalling: false,
  isAnswered: false,
  state: 'IDLING',
}

export const ELEVATOR_INITIAL_STATE = {
  state: ELEVATOR_STATUS.FREE,
  position: 1,
  target: 1
}

export const newFloor = floorNum => ({
  ...FLOOR_INITIAL_STATE,
  floorNum,
});

const rangeGenerator = count => generate => (
  [...Array(count).keys()]
    .map(i =>
      generate(
        inc(i)
      )
    ).sort((prev, next) => prev.floorNum < next.floorNum)
);

const initialStateFloors = rangeGenerator(FLOORS_COUNT);
const initialStateElevators = rangeGenerator(ELEVATORS_COUNT);

export const newElevator = elevatorId => ({
  ...ELEVATOR_INITIAL_STATE,
  elevatorId,
});

export function floorReducers (state = initialStateFloors(newFloor), action) {
  switch (action.type) {
    case TOGGLE_CALL:
      return [
        ...state.slice(0, state.length - action.floorNum),
        Object.assign({}, state[state.length - action.floorNum], {
          isCalling: !state[state.length - action.floorNum].isCalling
        }),
        ...state.slice(
          inc(state.length - action.floorNum)
        )
      ]
    case TOGGLE_ANSWER:
      return [
        ...state.slice(0, state.length - action.floorNum),
        Object.assign({}, state[state.length - action.floorNum], {
          isAnswered: !state[state.length - action.floorNum].isAnswered
        }),
        ...state.slice(
          inc(state.length - action.floorNum)
        )
      ]
    case ADD_FLOOR:
      return [
        newFloor(
          inc(state.length)
        ),
        ...state
      ]
    case SET_FLOOR_STATUS:
      return [
        ...state.slice(0, state.length - action.floorNum),
        Object.assign({}, state[state.length - action.floorNum], {
          state: action.status
        }),
        ...state.slice(
          inc(state.length - action.floorNum)
        )
      ]
    default:
      return state
  }
}

export function elevatorReducers (state = initialStateElevators(newElevator), action) {
  switch (action.type) {
    case ADD_ELEVATOR:
      return [
        ...state,
        newElevator(
          inc(state.length)
        )
      ]
    case SET_ELEVATOR_STATUS:
      return [
        ...state.slice(0, dec(action.elevatorId)),
        Object.assign({}, state[dec(action.elevatorId)], {state: action.status, target: action.target}),
        ...state.slice(action.elevatorId)
      ]
    case SET_ELEVATOR_POSITION:
      return [
        ...state.slice(0, dec(action.elevatorId)),
        Object.assign({}, state[dec(action.elevatorId)], {position: action.floorNum}),
        ...state.slice(action.elevatorId)
      ]
    default:
      return state
  }
}

