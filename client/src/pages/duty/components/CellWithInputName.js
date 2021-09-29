//core
import React from 'react'

//components
import CustomCell from "./CustomCell";

export default function CellWithInputName({user, index, dictWithName, setDictWithName, nameMass, arrWithPerson = [], groups}) {
    const value = dictWithName && dictWithName[nameMass] && index in dictWithName[nameMass] ? dictWithName[nameMass][index]['name'] : '';
    const group = dictWithName && dictWithName[nameMass] && index in dictWithName[nameMass] ? dictWithName[nameMass][index]['group'] : '';

    return (
        <td className="border p-1 align-top">
            <CustomCell
                user={user}
                index={index}
                value={value}
                group={group}
                dictWithName={dictWithName}
                setDictWithName={setDictWithName}
                nameMass={nameMass}
                arrWithPerson={arrWithPerson}
                groups={groups}
            />
        </td>
    )
}