import {DestroyPerson, InitPerson} from "../actions/actionsType";

const initialState = [];

export default function person(state = initialState, action) {
    switch (action.type) {
        case InitPerson:
            return [
                ...state,
                ...action.person,
            ];
        case DestroyPerson:
            return []
        default:
            return state
    }
}