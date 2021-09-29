//core
import {useState, useEffect, useMemo} from 'react'

//hooks
import {useDate} from "../../../core/hooks/useDate";

//functions
import workWithServer from '../../../core/workWithServer'
import {
    BalanceArr,
    balanceArrWithoutExtras,
    doubleBalanceArr,
    getElemFromObj,
    getSubList,
    balanceArrWithExtras, doubleBalanceArrWithExtras
} from "../../../core/localWorkWithList";
import {getWorkDayCountAll, getWorkDayCountFully} from "../../../core/localWorkWithDate";


export function useCalcDuty(user, group, rank, post, holiday) {
    const user_is_control = user.profile.find(el => el.page === 'listOfDuty' && el.action === 'control');
    const count_small_office_duty = 4;
    const {curr, currDate, setCurrDate, startDate, setStartDate, endDate, setEndDate} = useDate();
    const initPersonArray = {
        old_office_arr: [], old_office_count: 0,
        small_office_arr: [], small_office_count: 0,
        woman_arr: [], woman_count: 0,
        prapor_arr: [], prapor_count: 0,
        control_arr: [], control_count: 0,
        all_office_arr: [], all_office_count: 0
    };
    const [needSetPersonArray, setNeedSetPersonArray] = useState({
        need: true
    });
    const [personsArray, setPersonsArray] = useState(initPersonArray);

    // список всех дней в месяце
    const arrWithDate = useMemo(() => {
        const arr = [];
        const currentDate = new Date(startDate);
        while (endDate >= currentDate) {
            arr.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1)
        }
        return arr
    }, [startDate]);

    const [person, setPerson] = useState([]);

    useEffect(() => {
        workWithServer.getListOfAllPerson().then(setPerson)

    }, []);
    const groups = useMemo(() => group.filter(el => el.forDuty), [group]);
    const personMilitary = useMemo(() => person.filter(el => el.is_military).reduce((acc,el) => {
        const person_rank = rank.find(r => r.id === el.rank_id);
        if (person_rank && person_rank.useDuty) {
            el.rank = person_rank;
            acc.push(el);
        }
        return acc
    }, []), [person]);

    const cellCount = 4 + groups.length;

    useEffect(() => {
        if (group && personMilitary.length > 0) {
            if (needSetPersonArray.need) {
                setPersonsArray(persons_array(groups, group, personMilitary, rank, post, user))
            }
        }
    }, [group, personMilitary, needSetPersonArray, groups]);


    const all_office_arr = new Array(groups.length)
        .fill(0)
        .map((_, index) => Number(personsArray.small_office_arr[index]) + Number(personsArray.old_office_arr[index]) + Number(personsArray.prapor_arr[index]));

    const all_police_arr = new Array(groups.length)
        .fill(0)
        .map((_, index) => Number(personsArray.small_office_arr[index]) + Number(personsArray.old_office_arr[index]));



    const all_office_count = all_office_arr.reduce((acc, value) => acc + value, 0);
    const all_police_count = all_police_arr.reduce((acc, value) => acc + value, 0);

    // Распределение нарядов между подразделениями
    const count_days = endDate.getDate();
    const workDays = getWorkDayCountAll(new Date(startDate), new Date(endDate), holiday);
    const workFullDays = getWorkDayCountFully(new Date(startDate), new Date(endDate), holiday);

    const [policemanOfDuty, setPolicemanOfDuty] = useState(0);
    const [skipArrPolice, setSkipArrPolice] = useState([]);

    const [zsspdOfDuty, setZsspdOfDuty] = useState(Math.ceil(workDays / 2));
    const [corOfDuty, setCorOfDuty] = useState(Math.ceil(workDays / 2));
    const [warehouseOfDuty, setWarehouseOfDuty] = useState(Math.ceil(workDays / 2));
    const [buildingOfDuty, setBuildingOfDuty] = useState(Math.ceil(workDays / 2));

    const [prev_nameByDay, setPrev_nameByDay] = useState({});
    const [nameByDay, setNameByDay] = useState({});
    const [countDutyInHolidays, setCountDutyInHolidays] = useState([]);

    const zsspd_arr = new Array(groups.length).fill(0);
    const zsspd_index = groups.findIndex(el => el.name === '3 НИУ');
    zsspd_arr[zsspd_index] = zsspdOfDuty;
    const zsspd_count = zsspd_arr.reduce((acc, value) => acc + value, 0);

    const cor_arr = new Array(groups.length).fill(0);
    const cor_index = groups.findIndex(el => el.name === 'НИЦ (ОР)');
    cor_arr[cor_index] = corOfDuty;
    const cor_count = cor_arr.reduce((acc, value) => acc + value, 0);

    const warehouse_arr = new Array(groups.length).fill(0);
    const warehouse_index = groups.findIndex(el => el.name === 'НИЦ');
    warehouse_arr[warehouse_index] = warehouseOfDuty;
    const warehouse_count = warehouse_arr.reduce((acc, value) => acc + value, 0);

    const building_arr = new Array(groups.length).fill(0);
    const building_index = groups.findIndex(el => el.name === 'НИЦ (ИЯЗ)');
    building_arr[building_index] = buildingOfDuty;
    const building_count = building_arr.reduce((acc, value) => acc + value, 0);

    const dch_arr = new Array(groups.length).fill(0);
    const pdch_arr = new Array(groups.length).fill(0);
    const pdch2_arr = new Array(groups.length).fill(0);
    const pdch3_arr = new Array(groups.length).fill(0);
    const pdch4_arr = new Array(groups.length).fill(0);
    const policeman_arr = new Array(groups.length).fill(0);

    const small_prapor_arr_extra = new Array(groups.length).fill(0);
    const small_arr_extra = new Array(groups.length).fill(0);

    personsArray.old_office_arr.forEach((byGroup, index) => {
        dch_arr[index] = personsArray.old_office_count !== 0
            ? Math.ceil((byGroup * count_days / (personsArray.old_office_count)))
            : 0;
    });


    personsArray.small_office_arr.forEach((byGroup, index) => {
        const groupOfOffice = groups[index];
        let extraData = 0;
        if (groupOfOffice.name === '3 НИУ') extraData = zsspd_count / count_small_office_duty;
        else if (groupOfOffice.name === 'НИЦ') extraData = warehouse_count / count_small_office_duty;
        else if (groupOfOffice.name === 'НИЦ (ИЯЗ)') extraData = building_count / count_small_office_duty;
        else if (groupOfOffice.name === 'НИЦ (ОР)') extraData = cor_count / count_small_office_duty;
        if (byGroup < extraData) extraData = 0;

        small_arr_extra[index] = byGroup - extraData;
        small_prapor_arr_extra[index] = byGroup + personsArray.prapor_arr[index] - extraData;

        const count_with_prapor = personsArray.small_office_count !== 0
            ? Math.ceil((small_prapor_arr_extra[index] * count_days / (personsArray.small_office_count + personsArray.prapor_count)))
            : 0;

        const count_without_prapor = personsArray.small_office_count !== 0
            ? Math.ceil((small_arr_extra[index] * count_days / (personsArray.small_office_count)))
            : 0;

        pdch_arr[index] = count_without_prapor;
        pdch2_arr[index] = count_without_prapor;
        pdch3_arr[index] = count_with_prapor;
        pdch4_arr[index] = count_with_prapor;

    });


    all_police_arr.forEach((byGroup, index) => {
        const groupOfOffice = groups[index];
        let extraData = 0;
        if (groupOfOffice.name === '3 НИУ') extraData = zsspd_count / count_small_office_duty;
        else if (groupOfOffice.name === 'НИЦ') extraData = warehouse_count / count_small_office_duty;
        else if (groupOfOffice.name === 'НИЦ (ИЯЗ)') extraData = building_count / count_small_office_duty;
        else if (groupOfOffice.name === 'НИЦ (ОР)') extraData = cor_count / count_small_office_duty;
        if (byGroup < extraData) extraData = 0;

        policeman_arr[index] = all_police_count !== 0
            ? Math.ceil((byGroup * policemanOfDuty / all_police_count))
            : 0;
    });

    let dch_count = dch_arr.reduce((acc, value) => acc + value, 0);
    let delta_dch_count = dch_count - count_days;

    let pdch_count = pdch_arr.reduce((acc, value) => acc + value, 0);
    let delta_pdch_count = pdch_count - count_days;

    let pdch2_count = pdch2_arr.reduce((acc, value) => acc + value, 0);
    let delta_pdch2_count = pdch2_count - count_days;

    let pdch3_count = pdch3_arr.reduce((acc, value) => acc + value, 0);
    let delta_pdch3_count = pdch3_count - count_days;

    let pdch4_count = pdch4_arr.reduce((acc, value) => acc + value, 0);
    let delta_pdch4_count = pdch4_count - count_days;

    let policeman_count = policeman_arr.reduce((acc, value) => acc + value, 0);
    let delta_policeman_count = policeman_count - policemanOfDuty;


    let allDuty_arr = new Array(groups.length).fill(0).map((_, index) => {
        return dch_arr[index] + pdch_arr[index] + pdch2_arr[index] + pdch3_arr[index] + pdch4_arr[index] + policeman_arr[index]
            + zsspd_arr[index] + cor_arr[index] + warehouse_arr[index] + building_arr[index]
    });

    let commonKf_arr = allDuty_arr.map((el, index) => {
        const persons = all_office_arr[index];
        return persons > 0 ? parseFloat((el / persons).toFixed(2)) : 0
    });

    function reCalc_commonKf_arr(index, value) {
        allDuty_arr[index] += value;
        commonKf_arr[index] = parseFloat((allDuty_arr[index] / all_office_arr[index]).toFixed(2))
    }


    balanceArrWithoutExtras(dch_arr, delta_dch_count, personsArray.old_office_arr, commonKf_arr, reCalc_commonKf_arr);
    doubleBalanceArr(dch_arr, personsArray.old_office_arr, reCalc_commonKf_arr);
    dch_count = dch_arr.reduce((acc, value) => acc + value, 0);

    // balanceArrWithoutExtras(policeman_arr, delta_policeman_count, all_police_arr, commonKf_arr, reCalc_commonKf_arr);
    // doubleBalanceArr(policeman_arr, all_police_arr, reCalc_commonKf_arr);
    // policeman_count = policeman_arr.reduce((acc, value) => acc + value, 0);

    // balanceArrWithExtras(dch_arr, delta_dch_count, commonKf_arr, reCalc_commonKf_arr);
    // dch_count = dch_arr.reduce((acc, value) => acc + value, 0);

    balanceArrWithExtras(pdch_arr, delta_pdch_count, small_arr_extra, commonKf_arr, reCalc_commonKf_arr);
    pdch_count = pdch_arr.reduce((acc, value) => acc + value, 0);

    balanceArrWithExtras(pdch2_arr, delta_pdch2_count, small_arr_extra, commonKf_arr, reCalc_commonKf_arr);
    pdch2_count = pdch2_arr.reduce((acc, value) => acc + value, 0);

    balanceArrWithExtras(pdch3_arr, delta_pdch3_count, small_prapor_arr_extra, commonKf_arr, reCalc_commonKf_arr);
    pdch3_count = pdch3_arr.reduce((acc, value) => acc + value, 0);

    balanceArrWithExtras(pdch4_arr, delta_pdch4_count, small_prapor_arr_extra, commonKf_arr, reCalc_commonKf_arr);
    pdch4_count = pdch4_arr.reduce((acc, value) => acc + value, 0);

    balanceArrWithExtras(policeman_arr, delta_policeman_count, all_police_arr, commonKf_arr, reCalc_commonKf_arr);
    policeman_count = policeman_arr.reduce((acc, value) => acc + value, 0);

    const allDuty = count_days * 5 + policemanOfDuty + zsspdOfDuty + corOfDuty + warehouseOfDuty + buildingOfDuty;
    const allDuty_count = allDuty_arr.reduce((acc, value) => acc + value, 0);

    const commonKf_count = (all_office_count + personsArray.woman_count) > 0
        ? parseFloat((allDuty_count / (all_office_count + personsArray.woman_count)).toFixed(2))
        : 0;


    const controlDuty_arr = personsArray.control_arr.map(el => {
        if (el > 0 && personsArray.control_count > 0) {
            let control_cf = Math.ceil(el / personsArray.control_count * count_days);
            return control_cf === 0 ? 1 : control_cf;
        }
        else {
            return 0;
        }
    });


    let controlDuty_count = controlDuty_arr.reduce((acc, value) => acc + value, 0);
    let delta_controlDuty = controlDuty_count - count_days;


    const controlKf_arr = controlDuty_arr.map((el, index) => personsArray.control_arr[index] > 0
        ? parseFloat((el / personsArray.control_arr[index]).toFixed(2))
        : 0);


    function reCalc_controlKf_arr(index, value) {
        controlKf_arr[index] = parseFloat((controlDuty_arr[index] / personsArray.control_arr[index]).toFixed(2))
    }

    // balanceArrWithExtras(controlDuty_arr, delta_controlDuty, controlKf_arr, reCalc_controlKf_arr);
    // controlDuty_count = controlDuty_arr.reduce((acc, value) => acc + value, 0);

    balanceArrWithoutExtras(controlDuty_arr, delta_controlDuty, personsArray.control_arr, controlKf_arr, reCalc_controlKf_arr);
    doubleBalanceArr(controlDuty_arr, personsArray.control_arr, reCalc_controlKf_arr);
    controlDuty_count = controlDuty_arr.reduce((acc, value) => acc + value, 0);

    const controlKf_total = personsArray.control_count > 0
        ? parseFloat((controlDuty_count / personsArray.control_count).toFixed(2))
        : 0;

    useEffect(() => {
        workWithServer
            .getDutyInfo({
                data: {
                    date: currDate
                }
            })
            .then(data => {
                setPolicemanOfDuty(data.policeman);
                if (data.zsspdOfDuty) {
                    setZsspdOfDuty(data.zsspdOfDuty);
                } else {
                    setZsspdOfDuty(Math.ceil(workDays / 2))
                }
                if (data.corOfDuty) {
                    setCorOfDuty(data.corOfDuty);
                } else {
                    setCorOfDuty(Math.ceil(workDays / 2))
                }
                if (data.warehouseOfDuty) {
                    setWarehouseOfDuty(data.warehouseOfDuty);
                } else {
                    setWarehouseOfDuty(Math.ceil(workDays / 2))
                }
                if (data.buildingOfDuty) {
                    setBuildingOfDuty(data.buildingOfDuty);
                } else {
                    setBuildingOfDuty(Math.ceil(workDays / 2))
                }
                setSkipArrPolice(data.policeman_skip);
                setPrev_nameByDay(data.prev_nameByDay);
                setNameByDay(data.nameByDay);
                if (data.personArray) {
                    setPersonsArray(data.personArray);
                    setNeedSetPersonArray({need: false});
                } else {
                    setNeedSetPersonArray({need: true});
                }
                setCountDutyInHolidays(data.countDutyInHolidays.map(el => {
                    el.group = groups.find(group => group.id === el.group_id);
                    return el
                }))
            })
    }, [currDate]);

    const personArrForUser = [];

    const obj_with_group_index = groups.reduce((acc, el) => {
        const el_ChildrenList = getElemFromObj(getSubList(el, group));
        const parent_id = el.parent_id;
        const parent_obj = {};
        if (parent_id && acc[parent_id]) {
            parent_obj[parent_id] = acc[parent_id].filter(value => el_ChildrenList.indexOf(value) < 0)
        }
        return {...acc, ...parent_obj, [el.id]: el_ChildrenList}
    }, {});

    const groups_for_control = {};
    groups.forEach((person_group, index) => {
        groups_for_control[person_group.name] = [];
        const el_ChildrenList = obj_with_group_index[person_group.id];
        personMilitary.filter(person => {

            if(user_is_control && el_ChildrenList.indexOf(person.real_group_id) !== -1 ){
                groups_for_control[person_group.name] = [...groups_for_control[person_group.name], person]
            }
            if (el_ChildrenList.indexOf(person.real_group_id) !== -1 && el_ChildrenList.indexOf(user.group_id) !== -1) {
                personArrForUser.push(person);
            }
        });
    });
    return {
        date: {
            curr, currDate, setCurrDate, startDate, setStartDate, endDate, setEndDate, arrWithDate, holiday
        },
        duty: {
            groups, cellCount,
            personArrForUser,
            personMilitary,
            groups_for_control,
            all_office_arr, all_office_count,
            ...personsArray, setPersonsArray,
            count_days, workDays, workFullDays,
            countDutyInHolidays,

            dch_arr, dch_count,
            pdch_arr, pdch_count,
            pdch2_arr, pdch2_count,
            pdch3_arr, pdch3_count,
            pdch4_arr, pdch4_count,
            zsspdOfDuty, setZsspdOfDuty, zsspd_arr, zsspd_count,
            corOfDuty, setCorOfDuty, cor_arr, cor_count,
            warehouseOfDuty, setWarehouseOfDuty, warehouse_arr, warehouse_count,
            buildingOfDuty, setBuildingOfDuty, building_arr, building_count,
            commonKf_arr, commonKf_count,
            policeman_arr, policeman_count, policemanOfDuty, setPolicemanOfDuty, skipArrPolice, setSkipArrPolice,
            allDuty, allDuty_arr, allDuty_count,
            controlDuty_arr, controlDuty_count,
            controlKf_arr, controlKf_total,
            nameByDay, setNameByDay,
            prev_nameByDay, setPrev_nameByDay
        }
    }
}


// расчет личного состава
function persons_array(groups, group, personMilitary, rank, post, user) {
    const old_office_arr = new Array(groups.length).fill(0);
    const small_office_arr = new Array(groups.length).fill(0);
    const woman_arr = new Array(groups.length).fill(0);
    const prapor_arr = new Array(groups.length).fill(0);
    const control_arr = new Array(groups.length).fill(0);

    const obj_with_group_index = groups.reduce((acc, el) => {
        const el_ChildrenList = getElemFromObj(getSubList(el, group));
        const parent_id = el.parent_id;
        const parent_obj = {};
        if (parent_id && acc[parent_id]) {
            parent_obj[parent_id] = acc[parent_id].filter(value => el_ChildrenList.indexOf(value) < 0)
        }
        return {...acc, ...parent_obj, [el.id]: el_ChildrenList}
    }, {});

    groups.forEach((person_group, index) => {
        const el_ChildrenList = obj_with_group_index[person_group.id];
        personMilitary.filter(person => {
            const person_rank = rank.find(el => el.id === person.rank_id);
            const person_post = post.find(el => el.id === person.post_id);
            if (el_ChildrenList.indexOf(person.real_group_id) !== -1) {
                if (person_rank && person_rank.useDuty) {
                    person.rank = person_rank;
                    if (!!person_post) {
                        if (person_post.is_watch) control_arr[index] += 1;
                        else if (!person.is_gender) woman_arr[index] += 1;
                        else if (!!person_rank.type && person_post.is_duty) {
                            if (person_rank.type.name === 'старший офицер') old_office_arr[index] += 1;
                            else if (person_rank.type.name === 'младший офицер') small_office_arr[index] += 1;
                            else if (person_rank.type.name === 'прапорщик') prapor_arr[index] += 1
                        }
                    }
                }
            }
        });
    });

    const old_office_count = old_office_arr.reduce((acc, value) => acc + value, 0);
    const small_office_count = small_office_arr.reduce((acc, value) => acc + value, 0);
    const control_count = control_arr.reduce((acc, value) => acc + value, 0);
    const woman_count = woman_arr.reduce((acc, value) => acc + value, 0);
    const prapor_count = prapor_arr.reduce((acc, value) => acc + value, 0);
    return {
        old_office_arr, old_office_count,
        small_office_arr, small_office_count,
        woman_arr, woman_count,
        prapor_arr, prapor_count,
        control_arr, control_count,
    }
}