import {InitStatus} from "../actions/actionsType";

const initialState = [];

export default function status(state = initialState, action) {
    switch (action.type) {
        case InitStatus:
            return [
                ...state,
                ...action.status,
            ];
        default:
            return state
    }
}