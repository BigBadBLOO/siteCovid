import {combineReducers} from 'redux'
import user from "./reducers/user";
import rank from "./reducers/rank";
import holiday from "./reducers/holiday";
import group from "./reducers/group";
import status from "./reducers/status";
import person from "./reducers/person";
import post from "./reducers/post";

export default combineReducers({
  user, rank, holiday, group, status, person, post
})