//functions
import {isHoliday, isWeekends} from "../../../core/localWorkWithDate";

const manyPos = (arr) => {
    let result = 1;

    arr = arr.filter(el => el > 0);

    if(arr.length !== 0) {
        const max_val = Math.max.apply(null, arr);
        const avg_val = Math.floor(arr.reduce((el, a) => el + a, 0) / arr.length);

        result = avg_val / max_val;
    }

    // if(arr.length !== 0) {
    //     const max_val = Math.max.apply(null, arr);
    //     const min_val = Math.min.apply(null, arr);
    //
    //     result =  min_val / max_val;
    // }


    return result;
};

const getRowWeight = (nameByDay, group_name, day, arr_marker) => {
    const arr_with_type_duty = Object.keys(nameByDay);
    const index = arr_with_type_duty.indexOf(arr_marker);
    let rate = 1;


    for (let i = index - 3; i < index; i++) {
        if (i >= 0
            && nameByDay[arr_with_type_duty[i]]
            && nameByDay[arr_with_type_duty[i]][day]
            && nameByDay[arr_with_type_duty[i]][day].group === group_name
        ) {
            rate = 0.2;
            break;
        }
    }


    return rate;
};

const getColumnWeight = (nameByDay, group_name, day, arr_marker,delta) => {
    // for (let i = day - 1; i < day; i++) {
    //     if (i !== day) {
    //         // for (const type_duty of Object.keys(nameByDay)) {
    //         if (nameByDay[arr_marker][i] && nameByDay[arr_marker][i].group === group_name) {
    //             return 0.1;
    //         }
    //         // }
    //     }
    // }


    let rate = 1;
    // const weight_array = !!delta ? [0.1, 0.25] : [0.2];
    // const weight_array = arr_marker === 'dch_arr' ? [0.1, 0.25] : [0.2];
    const weight_array = [0.1, delta];
    for (let j = weight_array.length; j > 0; j--) {
        if (nameByDay[arr_marker][day - j] && nameByDay[arr_marker][day - j].group === group_name) {
            rate = weight_array[j - 1];
        }
    }

    return rate;
};

const getNewInColumn = (nameByDay, group_name, day, arr_marker) => {
    let rate = 2;

    for (let i = 0; i < day - 1; i++) {
        if (nameByDay[arr_marker][i] && nameByDay[arr_marker][i].group === group_name) {
            rate = 1;
            break;
        }
    }
    return rate;
};

export default function useDutyCalculation(duty, date, user) {
    const user_is_control = user.profile.find(el => el.page === 'listOfDuty' && el.action === 'control');
    const {
        dch_arr, pdch_arr, pdch2_arr, pdch3_arr, pdch4_arr,
        policeman_arr,
        controlDuty_arr,
    } = duty;

    const list_arr = {
        dch_arr: [...dch_arr], pdch_arr: [...pdch_arr], pdch2_arr: [...pdch2_arr],
        pdch3_arr: [...pdch3_arr], pdch4_arr: [...pdch4_arr],
        policeman_arr: [...policeman_arr], controlDuty_arr: [...controlDuty_arr],
    };


    const findGroupInDay = (nameByDay, arr_marker, day, groups, arr_with_data_by_group, countDutyInHolidays, type) => {

        let temp_arr = arr_with_data_by_group.map((el, idx) => {
            let delta = manyPos(arr_with_data_by_group);
            const group_name = groups[idx].name;
            let extraWeight = 1;
            if (countDutyInHolidays && type) {
                const currentType = countDutyInHolidays.find(el => {
                    return el.type === arr_marker && el.group.name === group_name
                });
                if (currentType && currentType.count_in_holiday > 0) {
                    if (type === 'holidays') extraWeight = currentType.count_in_holiday / duty.all_office_arr[idx];
                    if (type === 'weekends') extraWeight = currentType.count_in_weekend / duty.all_office_arr[idx];
                }
            }
            return el
                * getRowWeight(nameByDay, group_name, day, arr_marker)
                * getColumnWeight(nameByDay, group_name, day, arr_marker, delta)
                * getNewInColumn(nameByDay, group_name, day, arr_marker)
                / extraWeight
        });

        let value = Math.max.apply(null, temp_arr);

        let index = Object.keys(nameByDay).indexOf(arr_marker) % 2 === 0 ? temp_arr.indexOf(value) : temp_arr.lastIndexOf(value);

        arr_with_data_by_group[index] -= 1;

        if (countDutyInHolidays && type) {
            const group_name = groups[index].name;
            const currentType_index = countDutyInHolidays.findIndex(el => {
                return el.type === arr_marker && el.group.name === group_name
            });
            if (currentType_index >= 0) {
                if (type === 'holidays') {
                    const value = countDutyInHolidays[currentType_index]['count_in_holiday'];
                    countDutyInHolidays[currentType_index]['count_in_holiday'] = value ? value + 1 : 1
                }
                if (type === 'weekends') {
                    const value = countDutyInHolidays[currentType_index]['count_in_weekends'];
                    countDutyInHolidays[currentType_index]['count_in_weekends'] = value ? value + 1 : 1
                }
            } else {
                countDutyInHolidays.push({
                    count_in_holiday: type === 'holidays' ? 1 : 0,
                    count_in_weekend: type === 'weekends' ? 1 : 0,
                    group_id: groups[index].id,
                    group: groups[index],
                    type: arr_marker
                })
            }
        }
        return groups[index].name
    };

    const setNameByDay = (list_arr = {}) => {
        const prev_NameByDay = duty.prev_nameByDay;
        const nameByDay = {};
        // add last two day of previously month
        Object.keys(prev_NameByDay).forEach(typeDuty => {
            nameByDay[typeDuty] = {};
            const keysDate = Object.keys(prev_NameByDay[typeDuty]);
            keysDate.slice(keysDate.length - 2, keysDate.length).forEach((day, index) => {
                nameByDay[typeDuty][index - 1] = prev_NameByDay[typeDuty][day]
            });
        });
        const countDutyInHolidays = [...duty.countDutyInHolidays];
        const add_group_in_nameByDay = (date, countDutyInHolidays, type) => {
            for (const arr_marker of Object.keys(list_arr)) {
                const type_arr = nameByDay[arr_marker];
                if (!type_arr) nameByDay[arr_marker] = {};

                const type_arr_day = nameByDay[arr_marker][date.getDate()];
                if (!type_arr_day) nameByDay[arr_marker][date.getDate()] = {};
                const skip = (arr_marker === 'policeman_arr' && duty.skipArrPolice.indexOf(date.getDate()) >= 0);
                const count_elem_arr = list_arr[arr_marker].reduce((acc, value) => acc + value, 0);

                if (skip) nameByDay[arr_marker][date.getDate()].group = "";

                if (!skip && count_elem_arr > 0) {
                    nameByDay[arr_marker][date.getDate()].group = findGroupInDay(nameByDay, arr_marker, date.getDate(), duty.groups, list_arr[arr_marker], countDutyInHolidays, type);
                }
            }
        };

        date.arrWithDate.map(dateFromArr => {
            if (isHoliday(dateFromArr, duty.holiday)) {
                add_group_in_nameByDay(dateFromArr, countDutyInHolidays, 'holidays')
            }
            else if (isWeekends(dateFromArr, duty.holiday)) {
                add_group_in_nameByDay(dateFromArr, countDutyInHolidays, 'weekends')
            }
            else {
                add_group_in_nameByDay(dateFromArr)
            }
        });

        return [nameByDay, countDutyInHolidays]
    };
    return Object.keys(duty.nameByDay).length === 0 && user_is_control
        ? setNameByDay(list_arr)
        : [duty.nameByDay, null]
}