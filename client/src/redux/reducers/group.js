import {InitGroup} from "../actions/actionsType";

const initialState = [];

export default function group(state = initialState, action) {
    switch (action.type) {
        case InitGroup:
            return [
                ...state,
                ...action.group,
            ];
        default:
            return state
    }
}