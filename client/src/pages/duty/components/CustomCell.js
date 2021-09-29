import React from 'react'
import {orderList} from "../../../core/localWorkWithList";

function CustomCell({user, index, group, value, dictWithName, setDictWithName, nameMass, arrWithPerson, groups}) {
    const user_is_editor = user.profile.find(el => el.page === 'listOfDuty' && el.action === 'edit');
    const user_is_control = user.profile.find(el => el.page === 'listOfDuty' && el.action === 'control');

    let list_of_person = arrWithPerson;
    let duty_groups = [];
    if (user_is_control) {
        list_of_person = groups[group] ? groups[group] : [];
        duty_groups = Object.keys(groups)
    }

    return (
        <>
            {
                user_is_control && group
                    ? <select
                        className="border-b border-blue-700 bg-transparent p-1 w-full"
                        value={group}
                        onChange={e => {
                            const value = e.target.value;
                            setDictWithName(prev => {
                                const prev_nameMass = dictWithName[nameMass] ? dictWithName[nameMass] : {};
                                return {
                                    ...dictWithName,
                                    [nameMass]: {
                                        ...prev_nameMass,
                                        [index]: {group: value}
                                    }
                                }
                            })

                        }}
                    >
                        {orderList(duty_groups, ['name']).map((el, idx) => <option key={idx}
                                                                                   value={el}>{el}</option>)}
                    </select>
                    : <p>{group}</p>
            }

            {(user_is_editor && group === user.user_group.name) || (user_is_control && group)
                ? <select
                    className="border-b border-blue-700 bg-transparent p-1 w-full"
                    value={value ? value : ""}
                    onChange={e => {
                        const value = e.target.value;
                        if (list_of_person.find(el => el.name.indexOf(value) !== -1)) {
                            const person = list_of_person.find(el => el.name === value);
                            const id = person ? person.id : '';
                            const rank = person ? person.rank.name : '';
                            setDictWithName(prev => {
                                return {
                                    ...dictWithName,
                                    [nameMass]: {
                                        ...dictWithName[nameMass],
                                        [index]: {...dictWithName[nameMass][index], name: value, rank, id}
                                    }
                                }
                            })
                        }
                    }}
                >
                    <option value=""/>
                    {
                        list_of_person.map(el => <option
                            key={el.id}
                            value={el.name}>
                            {el.name}
                        </option>)
                    }
                </select>
                : value && <div className="border-2 outline-none w-full h-full p-1 text-center">{value}</div>
            }
        </>
    )
}


export default CustomCell