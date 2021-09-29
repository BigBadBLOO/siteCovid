//core
import React from 'react'

//components
import {MyDatePicker} from "../../../components/MyDatePicker";

//functions
import {getElemFromObj, getLevelObj, getSubList} from "../../../core/localWorkWithList";
import {getNameToGroupSelect} from "../../../core/localWorkWithGroup";
import {get_int} from "../../../core/localWorkWithNumber";
import {Link} from "react-router-dom";
import Button from "../../../components/Button";
import clsx from "clsx";

export default function PanelWithFunctional({user, group, date, search, tableContent, setTableContent}) {

    const user_permission = user.profile.find(el => el.action === 'get_all_user');
    const userGroupSub = user_permission ? getLevelObj(user.user_group_sub) : user.user_group_sub;
    const userGroupSubId = user_permission ? getElemFromObj(userGroupSub) : user.user_group_sub_id;

    return (
        <div>
              <span className="my-auto p-2 ml-2 border rounded border-blue-600">
                  <Button
                      className={clsx({
                          'underline': tableContent === 'main'
                      })}
                      type='link'
                      text="Основная"
                      onClick={() => setTableContent('main')}
                  />
                  <Button
                      className={clsx({
                          'underline': tableContent === 'vaccine'
                      })}
                      type='link'
                      text="Вакцинация"
                      onClick={() => setTableContent('vaccine')}
                  />
              </span>

            {
                tableContent === 'main' && <MyDatePicker
                    curr={date.curr}
                    currDate={date.currDate}
                    setCurrDate={date.setCurrDate}
                    setStartDate={date.setStartDate}
                    setEndDate={date.setEndDate}
                />
            }
            <div className="float-right">
                <select
                    value={search.searchByVaccine}
                    className="w-56 h-full border-b border-blue-700 bg-white m-2 p-1"
                    onChange={e => {
                        let value = e.target.value;
                        search.setSearchByVaccine(value);
                    }}
                >
                    <option value="">Все</option>
                    <option value="missing">Отсутствует вакцина</option>
                    <option value="need">Требуется вакцина</option>
                    <option value="active">Активная вакцина</option>
                </select>
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
                        userGroupSub.map(el => <option key={el.id} value={el.id}>
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
