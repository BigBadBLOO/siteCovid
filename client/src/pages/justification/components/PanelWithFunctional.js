//core
import React from 'react'
import DatePicker from "react-datepicker";

//components
import  {InputForDatePicker} from "../../../components/Button";

//functions
import {getElemFromObj, getLevelObj, getSubList} from "../../../core/localWorkWithList";
import {getNameToGroupSelect} from "../../../core/localWorkWithGroup";
import {get_int} from "../../../core/localWorkWithNumber";


export default function PanelWithFunctional({user, group, date, search}) {
    return (
        <div>
            <select
                value={date.dateInterval}
                className="h-full border-b border-blue-700 bg-white m-2 p-1"
                onChange={e => {
                    let value = e.target.value;
                    date.setDateInterval(value);

                }}
            >
                <option value='current_day'>Текущий день</option>
                <option value='current_week'>Текущая неделя</option>
                <option value='current_month'>Текущий месяц</option>
                <option value='manual'>Выборочно</option>
            </select>
            {
                date.dateInterval === 'manual' && (<>
                <DatePicker
                    className="w-24 m-2 border-blue-700 rounded border"
                    selected={date.startDate}
                    showWeekNumbers
                    locale="ru"
                    maxDate={date.endDate}
                    onChange={(d) => {
                        let date_begin = new Date(d);
                        let date_end = date.endDate;
                        let currentDate = new Date(date_begin);
                        const arr_with_date = [];
                        while (currentDate <= date_end) {
                            arr_with_date.push(new Date(currentDate));
                            currentDate.setDate(currentDate.getDate() + 1)
                        }
                        date.setDate(prev => ({
                            ...prev,
                            startDate: date_begin,
                            arrWithDate: arr_with_date
                        }));
                    }}
                    dateFormat="dd.MM.yyyy"
                    customInput={<InputForDatePicker/>}
                />
                <DatePicker
                    className="w-24 m-2 border-blue-700 rounded border"
                    selected={date.endDate}
                    showWeekNumbers
                    locale="ru"
                    onChange={(d) => {
                        let date_begin = new Date(date.startDate);
                        let date_end = d;
                        let currentDate = new Date(date_begin);
                        const arr_with_date = [];
                        while (currentDate <= date_end) {
                            arr_with_date.push(new Date(currentDate));
                            currentDate.setDate(currentDate.getDate() + 1)
                        }
                        date.setDate(prev => ({
                            ...prev,
                            endDate: date_end,
                            arrWithDate: arr_with_date
                        }));
                    }}
                    minDate={date.startDate}
                    dateFormat="dd.MM.yyyy"
                    customInput={<InputForDatePicker/>}
                />
                </>)
            }
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
                            user.is_control
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
