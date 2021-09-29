import React from 'react'
import CustomCell from "./CustomCell";

export default function CellWithSkip({user, groups, index, dictWithName, setDictWithName, nameMass, enableSkipArr, skipArr, setSkipArr, skipArrMax, arrWithPerson = []}) {
    const value = dictWithName && dictWithName[nameMass] && index in dictWithName[nameMass] ? dictWithName[nameMass][index]['name'] : '';
    const group = dictWithName && dictWithName[nameMass] && index in dictWithName[nameMass] ? dictWithName[nameMass][index]['group'] : '';
    const user_is_control = user.profile.find(el => el.page === 'listOfDuty' && el.action === 'control');
    return (
        <td className="border p-1 relative align-top">
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
            {user_is_control && <span
                className="w-0 h-0 absolute top-0 right-0 border-solid border-8"
                style={{
                    borderColor: (skipArr.indexOf(index) !== -1 ? "#d27e7e #d27e7e " : "#aacaaa #aacaaa ") + "transparent transparent"
                }}
                onClick={() => {
                    if (enableSkipArr) {
                        const idx = skipArr.indexOf(index);
                        setSkipArr(prev => {
                            if (idx !== -1) {
                                let temp = [...prev];
                                temp.splice(idx, 1);
                                return temp
                            } else {
                                if (skipArr.length < skipArrMax) {
                                    return [...prev, index];
                                }
                                else {
                                    alert('Вы можете указать не более ' + skipArrMax + ' свободных дней для \nДежурный по военной комендатуре');
                                    return [...prev];
                                }
                            }

                        });
                    }
                    else {
                        alert('Нажмите кнопку "Пересчитать"');
                    }
                }}/>}
        </td>
    )
}