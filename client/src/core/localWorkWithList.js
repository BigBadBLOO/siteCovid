import {compareDate} from "./localWorkWithDate";

export function getFirst(arr) {
  return !!arr.length ? arr[0] : null;
}

export function getLast(arr) {
  return !!arr.length ? arr[arr.length - 1] : null;
}

export function getVaccineStatus(vaccine) {
  return vaccine !== null
      ? compareDate(vaccine.countComponent === 1 || vaccine.second_date === null
      ? vaccine.first_date
      : vaccine.second_date, new Date(), {month: 6}) === 1
      : null;
}

export function getLevelObj(objList, levelId = null) {
  return objList.filter(el => el.parent_id === levelId);
}

export function getSubList(obj, objList) {
  let result = [];

  if (!!obj) {
    obj = typeof obj === 'object' ? obj : objList.find(el => el.id === obj);
    result = [obj].concat(...orderTree(objList, obj.id))
  }
  return result;
}

export function getMainParent(obj, objList) {
  let result = null;
  if (!!obj) {
    obj = typeof obj === 'object' ? obj : objList.find(el => el.id === obj);
    result = objList.find(el => el.id === obj.parent_id);
  }
  return result;
}

export function getElemFromObj(objList, key) {
  let result = [];
  key = !!key ? key : 'id';
  if (!!objList) {
    result = objList.map(el => el[key])
  }
  return result;
}

export function getSumElemFromObj(objList, key) {
  let result = 0;
  key = !!key ? key : null;
  if (!!objList) {
    objList.forEach(el => {
      result += !!el[key] ? el[key] : 1;
    })
  }
  return result;
}


export function orderTree(objList, levelId = null) {
  let result = [];
  if (!!objList) {
    let levelList = getLevelObj(objList, levelId);

    levelList.forEach(el => {
      result.push(el);
      let treeList = orderTree(objList, el.id);
      if (treeList.length !== 0) {
        result.push(...treeList);
      }
    });
  }
  return result;
}

export function orderList(objList, keyList) {
  let result = [];
  if (!keyList) {
    return objList;
  }
  if (typeof keyList !== 'object') {
    keyList = [keyList];
  }
  if (!!objList) {
    result = objList.sort((a, b) => compare(a, b, keyList))
  }
  return result;
}


export function compare(a, b, key) {
  if (!key.length) {
    return 0;
  }
  let one_key = key[0];
  let delta = 1;
  if (one_key[0] === '~') {
    delta = -1;
    one_key = one_key.substr(1)
  }
  if (a[one_key] < b[one_key]) {
    return -1 * delta;
  }
  if (a[one_key] > b[one_key]) {
    return delta;
  }
  return compare(a, b, key.slice(1));
}


export function balanceArrWithExtras(mass, delta, list_of_people_count, commonKf_arr, reCalc_commonKf_arr) {
  const value = delta > 0 ? -1 : 1;
  while (delta !== 0) {
    if (mass.filter(el => el > 0).length === 0) {
      delta = 0;
      return
    }

    const filter_common_kf_arr = commonKf_arr.filter((_, index) => mass[index] > (delta > 0 ? 1 : 0));

    const value_kf = delta > 0
        ? Math.max.apply(null, filter_common_kf_arr)
        : Math.min.apply(null, filter_common_kf_arr);

    // const index = commonKf_arr.indexOf(value_kf);

    const master_coif = list_of_people_count.map((el, index) => {
      if (!!el) {
        return mass[index] / el;
      }
      return 0;
    });

    const index = can_be_selected(mass, delta, value_kf, commonKf_arr, master_coif);

    mass[index] += value;
    delta += value;
    reCalc_commonKf_arr(index, value)
  }
}

export function doubleBalanceArrWithExtras(mass, allDuty_arr, all_office_arr, commonKf_arr, reCalc_commonKf_arr) {
  while (true) {
    let is_balanced = [];
    const max_coif_list = all_office_arr.map((el, index) => {
      if (!!el && mass[index] > 1) {
        return (allDuty_arr[index] - 1) / el;
      }
      return 0;
    });

    const filter_max_coif_list = max_coif_list.filter((_, index) => mass[index] > 0);

    const max_coif = Math.max.apply(null, filter_max_coif_list);

    if (max_coif === 0) {
      break;
    }

    const index_from = max_coif_list.indexOf(max_coif);

    is_balanced = commonKf_arr.map((el, index) => {
      if (all_office_arr[index] > 0
          && el < max_coif
          && ((allDuty_arr[index] + 1) < all_office_arr[index])
          || (mass[index] === 0) && all_office_arr[index] !== 0) {
        return el;
      }
      return null;
    }).filter(el => el !== null).sort();

    if (!is_balanced.length) {
      break;
    }

    const cur_coif = Math.min.apply(null, is_balanced);
    const index_to = commonKf_arr.indexOf(cur_coif);

    mass[index_from] -= 1;
    reCalc_commonKf_arr(index_from, -1);

    mass[index_to] += 1;
    reCalc_commonKf_arr(index_to, 1);
  }
}


export function balanceArrWithoutExtras(mass, delta, list_of_people_count, commonKf_arr, reCalc_commonKf_arr) {
  const value = delta > 0 ? -1 : 1;
  while (delta !== 0) {
    if (mass.filter(el => el > 0).length === 0) {
      delta = 0;
      return
    }

    const master_coif = list_of_people_count.map((el, index) => {
      if (!!el) {
        return mass[index] / el;
      }
      return 0;
    });

    const filter_master_coif = master_coif.filter((_, index) => mass[index] > (delta > 0 ? 1 : 0));

    let value_kf = delta > 0
        ? Math.max.apply(null, filter_master_coif)
        : Math.min.apply(null, filter_master_coif);

    const index = can_be_selected(mass, delta, value_kf, master_coif, commonKf_arr);

    mass[index] += value;
    delta += value;
    reCalc_commonKf_arr(index, value);
  }
}

export function doubleBalanceArr(mass, list_of_people_count, reCalc_commonKf_arr) {
  while (true) {
    let is_balanced = [];
    const max_coif_list = list_of_people_count.map((el, index) => {
      if (!!el && mass[index] > 1) {
        return (mass[index] - 1) / el;
      }
      return 0;
    });

    const filter_max_coif_list = max_coif_list.filter((_, index) => list_of_people_count[index] > 0);

    const max_coif = Math.max.apply(null, filter_max_coif_list);

    if (max_coif === 0) {
      break;
    }

    const index_from = max_coif_list.indexOf(max_coif);

    const real_coif = list_of_people_count.map((el, index) => {
      if (!!el) {
        return mass[index] / el;
      }
      return 0;
    });

    is_balanced = real_coif.map((el, index) => {
      if (list_of_people_count[index] > 0
          && el < max_coif
          && ((mass[index] + 1) < list_of_people_count[index])
          || (mass[index] === 0) && list_of_people_count[index] !== 0) {
        return el;
      }
      return null;
    }).filter(el => el !== null).sort();

    if (!is_balanced.length) {
      break;
    }

    const cur_coif = Math.min.apply(null, is_balanced);
    const index_to = real_coif.indexOf(cur_coif);

    mass[index_from] -= 1;
    reCalc_commonKf_arr(index_from, -1);

    mass[index_to] += 1;
    reCalc_commonKf_arr(index_to, 1);
  }
}

export function can_be_selected(mass, delta, value_kf, master_coif_list, support_coif_list) {

  let index = master_coif_list.indexOf(value_kf);

  const can_be_selected = master_coif_list.map((el, index) => {
    if (el === value_kf) {
      return index;
    }
    return null;
  }).filter(el => el !== null);

  if (can_be_selected.length !== 1) {
    const filter_commonKf_arr = support_coif_list.map((el, index) => {
      if (mass[index] > (delta > 0 ? 1 : 0) && can_be_selected.indexOf(index) !== -1) {
        return el;
      }
      return null;
    }).filter(el => el !== null);

    value_kf = delta > 0
        ? Math.max.apply(null, filter_commonKf_arr)
        : Math.min.apply(null, filter_commonKf_arr);

    index = support_coif_list.indexOf(value_kf);
  }

  return index;
}


export function move_arr_elem(arr, count, type) {
  let result = [];
  if (type === 'right') {
    result = [
      ...[...arr].splice(arr.length - count, count),
      ...[...arr].slice(0, arr.length - count)
    ]
  }
  return result
}


export function make_mass_with_type(count_days, mass, groups) {
  const result = [];
  const skip_group = {};

  for (let i = 0; i < count_days; i++) {
    let flag = true;
    let temp_mass = [...mass];
    const keys = Object.keys(skip_group);
    for (const key of keys) {
      if (skip_group[key] > 0) skip_group[key] -= 1
    }
    while (flag) {
      let value = temp_mass.length > 0 ? Math.max.apply(null, temp_mass) : Math.max.apply(null, mass);
      let index = mass.indexOf(value);
      while ((flag && index !== -1)) {
        if (mass[index] === 0 || (skip_group[index] > 0 && temp_mass.length > 0)) {
          let index = temp_mass.indexOf(value);
          temp_mass.splice(index, 1)
        } else {
          skip_group[index] = 3;
          mass[index] -= 1;
          result.push(groups[index].name);
          flag = false;
        }
        index = mass.indexOf(value, index + 1);
      }
    }
  }
  return result
}

export function make_arr_with_skip(arr, skip_arr) {
  const result = [...arr];
  skip_arr.sort((a, b) => a - b).forEach(idx => {
    result.splice(idx, 0, '')
  });
  return result
}

