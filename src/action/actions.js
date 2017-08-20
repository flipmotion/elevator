import { inc, dec } from 'ramda';

import {
  ADD_FLOOR,
  ADD_ELEVATOR,
  TOGGLE_CALL,
  TOGGLE_ANSWER,
  SET_FLOOR_STATUS,
  SET_ELEVATOR_STATUS,
  SET_ELEVATOR_POSITION,
  ELEVATOR_STATUS,
} from '../constants';

export const addFloor = () => ({
  type: ADD_FLOOR,
});

export const addElevator = () => ({
  type: ADD_ELEVATOR,
});

const toggleCall = floorNum => ({
  type: TOGGLE_CALL,
  floorNum,
});

const toggleAnswer = floorNum => ({
  type: TOGGLE_ANSWER,
  floorNum,
});

const setFloorStatus = (floorNum, status) => ({
  type: SET_FLOOR_STATUS,
  floorNum,
  status,
});


const setElevatorStatus = (elevatorId, status, target) => ({
  type: SET_ELEVATOR_STATUS,
  elevatorId,
  status,
  target,
});

const setElevatorPosition = (elevatorId, floorNum) => ({
  type: SET_ELEVATOR_POSITION,
  elevatorId,
  floorNum,
})

const shouldToggleCall = ({ floors, elevators }, floorNum) => {
  const stayingElevators = elevators.filter(({ position, state }) => (position === floorNum) && (state === ELEVATOR_STATUS.STAYING));

  if (stayingElevators.length === 0 && !floors[floors.length - floorNum].isCalling) {
    return true;
  } else {
    return false;
  }
}

const callFreeElevatorTo = floorNum => (dispatch, getState) => {
  dispatch(
    toggleCall(floorNum)
  );
  dispatch(
    setFloorStatus(floorNum, 'SEARCHING FOR ELEVATOR.')
  );

  const freeElevator = getState().elevators.filter(({ state }) => {
    return state === ELEVATOR_STATUS.FREE;
  }).reduce((previous, current) => {
    if (Math.abs(floorNum - current.position) < Math.abs(floorNum - previous.position)) {
      return current;
    } else {
      return previous;
    }
  }, {
    position: Number.MAX_SAFE_INTEGER,
    elevatorId: 0,
  })

  if (freeElevator.elevatorId > 0) {
    dispatch(toggleAnswer(floorNum));
    dispatch(setFloorStatus(floorNum, `WAITING FOR ELEVATOR ${freeElevator.elevatorId}.`));
    dispatch(setElevatorStatus(freeElevator.elevatorId, ELEVATOR_STATUS.MOVING, floorNum));
    return dispatch(moveElevatorTo(freeElevator.elevatorId, floorNum));
  }
}

export const toggleCallIfNeeded = floorNum => (dispatch, getState) => {
  const isToggleCall = shouldToggleCall(getState(), floorNum);

  if (isToggleCall) {
    return dispatch(callFreeElevatorTo(floorNum));
  }
}

const moveElevatorTo = (elevatorId, floorNum) => (dispatch, getState) => {
  const elevators = [].concat(getState().elevators)
  const curPosition = elevators[dec(elevatorId)].position
  if (curPosition === floorNum) {
    dispatch(setElevatorStatus(elevatorId, ELEVATOR_STATUS.STAYING))
    dispatch(setFloorStatus(floorNum, `ELEVATOR ${elevatorId} IS HERE FOR 3 SECONDS.`))
    dispatch(toggleCall(floorNum))
    setTimeout(() => {
      dispatch(toggleAnswer(floorNum))
      dispatch(setFloorStatus(floorNum, 'IDLING.'))
      dispatch(setElevatorStatus(elevatorId, ELEVATOR_STATUS.FREE))
      dispatch(findWaitingFloor(elevatorId, curPosition))
    }, 3000)
  } else {
    setTimeout(() => {
      dispatch(setElevatorPosition(elevatorId, (curPosition < floorNum) ? inc(curPosition) : dec(curPosition)))
      dispatch(moveElevatorTo(elevatorId, floorNum))
    }, 1000)
  }
}

const findWaitingFloor = (elevatorId, curPos) => (dispatch, getState) => {
  const floors = getState().floors;

  const closestWaitingFloor = floors.filter((floor) => {
    return floor.isCalling && !floor.isAnswered
  }).reduce((previous, current) => {
    if (Math.abs(current.floorNum - curPos) < Math.abs(previous.floorNum - curPos)) {
      return current
    } else {
      return previous
    }
  }, {
    floorNum: Number.MAX_SAFE_INTEGER
  })

  if (closestWaitingFloor.floorNum < Number.MAX_SAFE_INTEGER) {
    dispatch(toggleAnswer(closestWaitingFloor.floorNum))
    dispatch(setFloorStatus(closestWaitingFloor.floorNum, `WAITING FOR ELEVATOR ${elevatorId}.`))
    dispatch(setElevatorStatus(elevatorId, ELEVATOR_STATUS.MOVING, closestWaitingFloor.floorNum))
    return dispatch(moveElevatorTo(elevatorId, closestWaitingFloor.floorNum))
  }
}
