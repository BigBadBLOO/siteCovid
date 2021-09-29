import {InitHolidays} from "../actions/actionsType";

const initialState = [];

export default function holiday(state = initialState, action) {
    switch (action.type) {
        case InitHolidays:
            return [
                ...state,
                ...action.holiday,
            ];
        default:
            return state
    }
}