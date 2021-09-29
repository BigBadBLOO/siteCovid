//core
import React from 'react'

//components
import {MyDatePicker} from "../../../components/MyDatePicker";
import Button from "../../../components/Button";

//functions
import {getElemFromObj, getLevelObj, getSubList} from "../../../core/localWorkWithList";
import {getNameToGroupSelect} from "../../../core/localWorkWithGroup";
import {get_int} from "../../../core/localWorkWithNumber";
import workWithServer from "../../../core/workWithServer";

export default function PanelWithFunctional({user, group, date, search, listOvertime, colorTrigger, setListOvertime}) {
    return (
        <div>
            <MyDatePicker
                curr={date.curr}
                currDate={date.currDate}
                setCurrDate={date.setCurrDate}
                setStartDate={date.setStartDate}
                setEndDate={date.setEndDate}
            />
            {
                user.profile.find(el => el.page === 'overtime' && el.action === 'edit') && <>
                    <Button
                        type='primary'
                        text="Сохранить"
                        onClick={() => {
                            workWithServer.setOvertime({
                                date: date.currDate,
                                overtime: listOvertime,
                            })
                        }}
                    />
                    <Button
                        type='primary'
                        text="Пересчитать"
                        onClick={() => setListOvertime()}
                    />
                </>
            }


            <Button
                type='primary'
                text="Скачать"
                onClick={() => {
                    workWithServer.request_overtime({
                        date: date.startDate,
                    }).then(r => {
                        const a = document.createElement('a');
                        a.href = r.xls;
                        a.download = "";
                        a.type = 'hidden';
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                    })
                }}
            />


            <select
                value={colorTrigger.colorTrigger}
                className="h-full border-b border-blue-700 bg-white m-2 p-1"
                onChange={e => {
                    let value = e.target.value;
                    colorTrigger.setColorTrigger(value)
                }}
            >
                <option value=''>Все</option>
                <option value='5'>Внимание</option>
                <option value='10'>Особое внимание</option>
            </select>

            <div className="float-right">
                <select
                    value={search.searchByGroup}
                    className="w-56 h-full border-b border-blue-700 bg-white m-2 p-1"
                    onChange={e => {
                        let value = get_int(e.target.value);
                        search.setSearchByGroup(value);
                        search.setSearchByGroupFull(getElemFromObj(getSubList(value, group)))
                    }}
                >
                    {
                        (
                            user.profile.find(el => el.action === 'get_all_user')
                                ? getLevelObj(user.user_group_sub)
                                : user.user_group_sub
                        ).map(el => <option key={el.id} value={el.id}>
                            {getNameToGroupSelect(el, group)}
                        </option>)
                    }
                </select>
                <input
                    className="bg-white m-2 rounded border outline-none text-base w-56 h-full border-blue-700 p-1"
                    placeholder="Поиск по имени..."
                    value={search.searchByName}
                    onChange={e => search.setSearchByName(e.target.value)}
                />
            </div>
        </div>
    )
}
