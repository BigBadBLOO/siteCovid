import {
    DestroyPerson,
    InitGroup,
    InitHolidays,
    InitPerson,
    InitPost,
    InitRank,
    InitStatus,
    InitUser
} from "./actionsType";

export function initUser(user) {
  return {
    type: InitUser,
    user
  }
}

export function initRank(rank) {
  return {
    type: InitRank,
    rank
  }
}

export function initPost(post) {
  return {
    type: InitPost,
    post
  }
}

export function initGroup(group) {
  return {
    type: InitGroup,
    group
  }
}

export function initHolidays(holiday) {
  return {
    type: InitHolidays,
    holiday
  }
}

export function initStatus(status) {
  return {
    type: InitStatus,
    status
  }
}

export function initPerson(person) {
  return {
    type: InitPerson,
    person
  }
}

export function destroyPerson(person) {
  return {
    type: DestroyPerson,
    person
  }
}