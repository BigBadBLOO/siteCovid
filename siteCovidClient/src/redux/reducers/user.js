import {InitUser} from "../actions/actionsType";

const initialState = {
  username: '',
  is_initial: false,
}

export default function user(state = initialState, action) {
  switch (action.type) {
    case InitUser:
      return {
        ...state,
        ...action.user,
      }
    default:
      return state
  }
}