import {InitPost} from "../actions/actionsType";

const initialState = [];

export default function post(state = initialState, action) {
    switch (action.type) {
        case InitPost:
            return [
                ...state,
                ...action.post,
            ];
        default:
            return state
    }
}