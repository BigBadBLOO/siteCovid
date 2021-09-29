// core
import React from 'react'

import {get_int} from "../../core/localWorkWithNumber";
import {connect} from "react-redux";

function MakeRow({name, arr, count, extraField = '', editable = false, setPersonsArray, marker}) {
    return <tr className="">
        <td className="border p-1" colSpan={2}>{name}</td>
        <td className="border p-1">{extraField}</td>
        {
            editable
                ? arr.map((el, index) => <td key={index} className="border p-1">
                    <input className="border rounded border-blue-700 p-1 outline-none w-12"
                           value={el}
                           onChange={(e) => {
                               let value = get_int(e.target.value);

                               setPersonsArray(prev => {
                                   const newArray = prev[marker];
                                   newArray[index] = Number(value);
                                   const count = newArray.reduce((acc, value) => acc + value, 0);
                                   const marker_count = marker.split('_').filter(el => el !== 'arr').join('_') + '_count';
                                   return {...prev, [marker]: newArray, [marker_count]: count}
                               })
                           }}
                    /></td>
                )
                : arr.map((el, index) => <td key={index} className="border p-1">{el}</td>)
        }
        <td className="border p-1">{count}</td>
    </tr>
}

function BlankDuty({duty, user}) {
    const user_is_control = user.profile.find(el => el.page === 'listOfDuty' && el.action === 'control');
    return (
        <>
            <table className="mt-1 text-xs break-words w-full">
                <thead>
                <tr className="">
                    <td className="border p-1" colSpan={2}/>
                    <td className="border p-1">Расчет нарядов</td>
                    {duty.groups.map(el => {
                        const parent = el.parent_id ? duty.groups.find(group => group.id === el.parent_id) : null;
                        const parent_name = parent ? parent.name : '';
                        return <td key={el.id} className="border p-1">{el.name + ' ' + parent_name}</td>
                    })}
                    <td className="border p-1">Итого</td>
                </tr>
                </thead>
                <tbody>
                <tr className="">
                    <td className="border p-1 text-center" colSpan={duty.cellCount}>Расчет личного состава</td>
                </tr>
                <MakeRow
                    name="Личный состав для нарядов"
                    arr={duty.all_office_arr}
                    count={duty.all_office_count}
                />

                <MakeRow
                    name="Старших офицеров"
                    arr={duty.old_office_arr}
                    count={duty.old_office_count}
                    editable={user_is_control}
                    setPersonsArray={duty.setPersonsArray}
                    marker="old_office_arr"
                />
                <MakeRow
                    name="Младших офицеров"
                    arr={duty.small_office_arr}
                    count={duty.small_office_count}
                    editable={user_is_control}
                    setPersonsArray={duty.setPersonsArray}
                    marker="small_office_arr"
                />
                <MakeRow
                    name="Прапорщиков и мичманов"
                    arr={duty.prapor_arr}
                    count={duty.prapor_count}
                    editable={user_is_control}
                    setPersonsArray={duty.setPersonsArray}
                    marker="prapor_arr"
                />
                <MakeRow
                    name="Военнослужащих женщин"
                    arr={duty.woman_arr}
                    count={duty.woman_count}
                    editable={user_is_control}
                    setPersonsArray={duty.setPersonsArray}
                    marker="woman_arr"
                />
                <MakeRow
                    name="Личный состав для контроля элементов распорядка дня"
                    arr={duty.control_arr}
                    editable={user_is_control}
                    setPersonsArray={duty.setPersonsArray}
                    count={duty.control_count}
                    marker="control_arr"
                />

                <tr className="">
                    <td className="border p-1 text-center" colSpan={duty.cellCount}>
                        Распределение нарядов между подразделениями
                    </td>
                </tr>
                <MakeRow name="Коэффициент" arr={duty.commonKf_arr} count={duty.commonKf_count}/>
                <MakeRow name="Всего нарядов" arr={duty.allDuty_arr} count={duty.allDuty_count}
                         extraField={duty.allDuty}/>
                <MakeRow name="ДЧ" arr={duty.dch_arr} count={duty.dch_count} extraField={duty.count_days}/>
                <MakeRow name="ПДЧ №1 (офицер)" arr={duty.pdch_arr} count={duty.pdch_count}
                         extraField={duty.count_days}/>
                <MakeRow name="ПДЧ №2 (офицер)" arr={duty.pdch2_arr} count={duty.pdch2_count}
                         extraField={duty.count_days}/>
                <MakeRow name="ПДЧ №3 (оф. или пр-к)" arr={duty.pdch3_arr} count={duty.pdch3_count}
                         extraField={duty.count_days}/>
                <MakeRow name="ПДЧ №4 (оф. или пр-к)" arr={duty.pdch4_arr} count={duty.pdch4_count}
                         extraField={duty.count_days}/>

                <tr className="">
                    <td className="border p-1" colSpan={2}>Дежурный по в/ком-ре *</td>
                    <td className="border">
                        {
                            user_is_control
                                ? <input
                                    className="border rounded border-blue-700 p-1 outline-none w-12"
                                    placeholder="" value={duty.policemanOfDuty}
                                    onChange={e => {
                                        const val = get_int(e.target.value);
                                        if (val <= duty.count_days) {
                                            duty.setPolicemanOfDuty(val)
                                        }
                                        else {
                                            duty.setPolicemanOfDuty(duty.count_days)
                                        }
                                    }
                                    }
                                />
                                : duty.policemanOfDuty
                        }

                    </td>
                    {duty.policeman_arr.map((el, index) => <td key={index} className="border p-1">{el}</td>)}
                    <td className="border p-1">{duty.policeman_count}</td>
                </tr>
                <tr className="">
                    <td className="border p-1">Дежурный по ЗССПД **</td>
                    <td className="border p-1">{duty.workDays}={duty.zsspdOfDuty}</td>
                    <td className="border">
                        {
                            user_is_control
                                ? <input
                                    className="border rounded border-blue-700 p-1 outline-none w-12"
                                    placeholder="" value={duty.zsspdOfDuty}
                                    onChange={e => {
                                        const val = get_int(e.target.value);
                                        if (val <= duty.count_days) {
                                            duty.setZsspdOfDuty(val)
                                        }
                                        else {
                                            duty.setZsspdOfDuty(duty.count_days)
                                        }
                                    }
                                    }
                                />
                                : duty.zsspdOfDuty
                        }
                    </td>
                    {duty.zsspd_arr.map((el, index) => <td key={index} className="border p-1">{el}</td>)}
                    <td className="border p-1">{duty.zsspd_count}</td>
                </tr>
                <tr className="">
                    <td className="border p-1">Дежурный по НИЦ (ОР) **</td>
                    <td className="border p-1">{duty.workDays}={duty.corOfDuty}</td>
                    <td className="border">
                        {
                            user_is_control
                                ? <input
                                    className="border rounded border-blue-700 p-1 outline-none w-12"
                                    placeholder="" value={duty.corOfDuty}
                                    onChange={e => {
                                        const val = get_int(e.target.value);
                                        if (val <= duty.count_days) {
                                            duty.setCorOfDuty(val)
                                        }
                                        else {
                                            duty.setCorOfDuty(duty.count_days)
                                        }
                                    }
                                    }
                                />
                                : duty.corOfDuty
                        }
                    </td>
                    {duty.cor_arr.map((el, index) => <td key={index} className="border p-1">{el}</td>)}
                    <td className="border p-1">{duty.cor_count}</td>
                </tr>
                <tr className="">
                    <td className="border p-1">Дежурный по сооружению**</td>
                    <td className="border p-1">{duty.workDays}={duty.warehouseOfDuty}</td>
                    <td className="border">
                        {
                            user_is_control
                                ? <input
                                    className="border rounded border-blue-700 p-1 outline-none w-12"
                                    placeholder="" value={duty.warehouseOfDuty}
                                    onChange={e => {
                                        const val = get_int(e.target.value);
                                        if (val <= duty.count_days) {
                                            duty.setWarehouseOfDuty(val)
                                        }
                                        else {
                                            duty.setWarehouseOfDuty(duty.count_days)
                                        }
                                    }
                                    }
                                />
                                : duty.warehouseOfDuty
                        }
                    </td>
                    {duty.warehouse_arr.map((el, index) => <td key={index} className="border p-1">{el}</td>)}
                    <td className="border p-1">{duty.warehouse_count}</td>
                </tr>
                <tr className="">
                    <td className="border p-1">Деж по стройплощадке**</td>
                    <td className="border p-1">{duty.workDays}={duty.buildingOfDuty}</td>
                    <td className="border">
                        {
                            user_is_control
                                ? <input
                                    className="border rounded border-blue-700 p-1 outline-none w-12"
                                    placeholder="" value={duty.buildingOfDuty}
                                    onChange={e => {
                                        const val = get_int(e.target.value);
                                        if (val <= duty.count_days) {
                                            duty.setBuildingOfDuty(val)
                                        }
                                        else {
                                            duty.setBuildingOfDuty(duty.count_days)
                                        }
                                    }
                                    }
                                />
                                : duty.buildingOfDuty
                        }
                    </td>
                    {duty.building_arr.map((el, index) => <td key={index} className="border p-1">{el}</td>)}
                    <td className="border p-1">{duty.building_count}</td>
                </tr>

                <tr className="">
                    <td className="border p-1 text-center" colSpan={duty.cellCount}>Распределение контроля элементов
                        распорядка дня между подразделениями
                    </td>
                </tr>
                <MakeRow name="Коэффициент" arr={duty.controlKf_arr} count={duty.controlKf_total}/>
                <MakeRow name="Контрол. распорядок дня" arr={duty.controlDuty_arr} count={duty.controlDuty_count}
                         extraField={duty.count_days}/>
                </tbody>

            </table>

            <p className="font-bold m-2">
                * - новый суточный наряд, в соответствии с требованиями Устава ВП;
            </p>

            <p className="font-bold m-2">
                ** - одно дежурство приравнивается к 0,5 суточного наряда.
            </p>
        </>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(BlankDuty);