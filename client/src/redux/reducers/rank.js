import {InitRank} from "../actions/actionsType";

const initialState = [];

export default function rank(state = initialState, action) {
    switch (action.type) {
        case InitRank:
            return [
                ...state,
                ...action.rank,
            ];
        default:
            return state
    }
}