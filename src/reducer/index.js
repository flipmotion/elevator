import { combineReducers } from 'redux';
import {
  floorReducers as floors,
  elevatorReducers as elevators,
} from './reducer';

const reducer = combineReducers({
  floors,
  elevators,
});

export default reducer;
