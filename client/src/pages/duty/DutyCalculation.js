//core
import React from 'react'
import {connect} from "react-redux";
import clsx from "clsx";

//components
import TableHeader from "./components/TableHeader";
import CellWithSkip from "./components/CellWithSkip";
import CellWithInputName from "./components/CellWithInputName";

//functions
import {compareDate, isDayNotNormal} from "../../core/localWorkWithDate";
import useDutyCalculation from "./hooks/useDutyCalculation";


export function DutyCalculation({user, duty, date, nameByDay,countDutyByDay, groups}) {
    const user_is_editor = user.profile.find(el => el.page === 'listOfDuty' && el.action === 'edit');
    const user_is_control = user.profile.find(el => el.page === 'listOfDuty' && el.action === 'control');

    let old_office = [];
    let small_office = [];
    let prapor = [];

    if(user_is_control){
        old_office = duty.personMilitary.filter(person => person.rank.type.name === 'старший офицер');
        small_office = duty.personMilitary.filter(person => person.rank.type.name === 'младший офицер');
        prapor = duty.personMilitary.filter(person => person.rank.type.name === 'прапорщик');
    }
    if(user_is_editor){
        old_office = duty.personArrForUser.filter(person => person.rank.type.name === 'старший офицер');
        small_office = duty.personArrForUser.filter(person => person.rank.type.name === 'младший офицер');
        prapor = duty.personArrForUser.filter(person => person.rank.type.name === 'прапорщик');
    }

    const small_and_prapor = [...prapor, ...small_office];

    const groups_for_duty = duty.groups_for_control;
    return (
        <table className="mt-1 text-xs break-words w-full">
            <TableHeader title=""/>
            <tbody>
            {
                date.arrWithDate.map((dateFromArr, index) => <tr
                    key={index}
                    className={clsx("p-01 border w-12 text-center align-middle cursor-default",
                        {
                            'bg-red-200 bg-opacity-25': isDayNotNormal(dateFromArr, date.holiday),
                            'bg-blue-200 bg-opacity-25': compareDate(dateFromArr, date.curr) === 0
                        }
                    )}>
                    <td className="border p-1">{index + 1}</td>

                    <CellWithInputName
                        user={user}
                        index={index + 1}
                        dictWithName={nameByDay}
                        setDictWithName={duty.setNameByDay}
                        nameMass="dch_arr"
                        arrWithPerson={old_office}
                        groups={groups_for_duty}
                    />
                    <CellWithInputName
                        user={user}
                        arrWithPerson={small_office}
                        index={index + 1}
                        dictWithName={nameByDay}
                        setDictWithName={duty.setNameByDay}
                        nameMass="pdch_arr"
                        groups={groups_for_duty}
                    />
                    <CellWithInputName
                        user={user}
                        arrWithPerson={small_office}
                        index={index + 1}
                        dictWithName={nameByDay}
                        setDictWithName={duty.setNameByDay}
                        nameMass="pdch2_arr"
                        groups={groups_for_duty}
                    />
                    <CellWithInputName
                        user={user}
                        arrWithPerson={small_and_prapor}
                        index={index + 1}
                        dictWithName={nameByDay}
                        setDictWithName={duty.setNameByDay}
                        nameMass="pdch3_arr"
                        groups={groups_for_duty}
                    />
                    <CellWithInputName
                        user={user}
                        arrWithPerson={small_and_prapor}
                        index={index + 1}
                        dictWithName={nameByDay}
                        setDictWithName={duty.setNameByDay}
                        nameMass="pdch4_arr"
                        groups={groups_for_duty}
                    />
                    <CellWithSkip
                        user={user}
                        arrWithPerson={duty.personArrForUser}
                        index={index + 1}
                        dictWithName={nameByDay}
                        setDictWithName={duty.setNameByDay}
                        nameMass="policeman_arr"
                        skipArr={duty.skipArrPolice}
                        skipArrMax={duty.count_days - duty.policemanOfDuty}
                        setSkipArr={duty.setSkipArrPolice}
                        enableSkipArr={countDutyByDay === 0}
                        groups={groups_for_duty}
                    />
                    <CellWithInputName
                        user={user}
                        arrWithPerson={old_office}
                        index={index + 1}
                        dictWithName={nameByDay}
                        setDictWithName={duty.setNameByDay}
                        nameMass="controlDuty_arr"
                        groups={groups_for_duty}
                    />
                </tr>)
            }
            </tbody>
        </table>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
        groups: state.group
    }
}

export default connect(mapStateToProps)(DutyCalculation);







