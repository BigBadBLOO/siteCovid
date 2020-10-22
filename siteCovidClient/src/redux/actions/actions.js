import {InitUser} from "./actionsType";

export function initUser(user) {
  return {
    type: InitUser,
    user
  }
}