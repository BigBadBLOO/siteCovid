//core
import React from 'react'
import clsx from "clsx";

//functions
import {getNameToGroupList} from "../../../core/localWorkWithGroup";

export default function Table({filterListOfPeople, rank, user, group, listOvertime, setListOvertime, colorTrigger}) {
    const inputHandler = (e, user_overtime, type) => {
        let value = e.target.value;
        if(value.indexOf('.') === 0){
            value = '0.'
        }else if(!value) {
            value = '0'
        }else if(value.indexOf('0') === 0 && value.length > 1 && value.indexOf('.') !== 1){
            value = value.replace('0','')
        }
        if (!isNaN(value) && Number(value) < 100 && value.length < 5) {
            setListOvertime(prev => prev.map(ov => {
                if (user_overtime && ov.user_id === user_overtime.user_id) {
                    ov[type] = value
                }
                return ov;
            }))
        }
    };

    return (
        <div>
            {filterListOfPeople.length === 0 ?
                <p className="text-center text-2xl">По вашему запросу ничего не найдено</p>
                :
                <table className="m-2 overflow-x-auto">
                    <thead className="">
                    <tr className="">
                        <td className="w-12 p-1 border text-center" rowSpan="4">№</td>
                        <td className="w-32 p-1 border text-center" rowSpan="4">Подразделение</td>
                        <td className="w-32 p-1 border text-center" rowSpan="4">Воинское звание</td>
                        <td className="w-56 p-1 border text-center" rowSpan="4">Фамилия и инициалы</td>
                        <td className="w-56 p-1 border text-center" rowSpan="4">Номер телефона</td>
                        <td className="w-56 p-1 border text-center" colSpan="11">Причина формирования дополнительного
                            отдыха:
                        </td>
                        <td className="w-56 p-1 border text-center" rowSpan="4">Итого переработки за месяц (сут/час.)
                        </td>
                        <td className="w-56 p-1 border text-center" colSpan="3">Учет реализации дополнительного отдыха
                            (сут.)
                        </td>
                        <td className="w-56 p-1 border text-center" rowSpan="4">Итого за месяц</td>
                        <td className="w-56 p-1 border text-center" rowSpan="4">Не реализовано ранее</td>
                        <td className="w-56 p-1 border text-center" rowSpan="4">Итого дополнительных дней отдыха</td>
                    </tr>
                    <tr className="">
                        <td className="w-12 p-1 border text-center" colSpan="5">несение службы в суточном наряде</td>
                        <td className="w-32 p-1 border text-center" colSpan="2">участие в мероприятиях проводимых без
                            ограничения (кроме ДСОО)
                        </td>
                        <td className="w-32 p-1 border text-center" colSpan="2">несение службы в ДСОО</td>
                        <td className="w-56 p-1 border text-center" colSpan="2">по другим причинам</td>
                        <td className="w-56 p-1 border text-center  " rowSpan="3">в рабочие дни</td>
                        <td className="w-56 p-1 border text-center  " rowSpan="3">к отпуску</td>
                        <td className="w-56 p-1 border text-center  " rowSpan="3">предоставлена денежная компенсация
                        </td>
                    </tr>
                    <tr className="">
                        <td className="w-12 p-1 border text-center  " colSpan="2">в рабочие дни</td>
                        <td className="w-32 p-1 border text-center  " colSpan="2">в нерабочие дни</td>
                        <td className="w-32 p-1 border text-center  " rowSpan="2">итого (в сут/час.)</td>
                        <td className="w-56 p-1 border text-center  " rowSpan="2">время привлечения (сут.)</td>
                        <td className="w-56 p-1 border text-center  " rowSpan="2">итого (сут.)</td>
                        <td className="w-56 p-1 border text-center  " rowSpan="2">кол-во</td>
                        <td className="w-56 p-1 border text-center  " rowSpan="2">итого (сут.)</td>
                        <td className="w-56 p-1 border text-center  " rowSpan="2">час.</td>
                        <td className="w-56 p-1 border text-center  " rowSpan="2">итого (сут.)</td>
                    </tr>
                    <tr className="">
                        <td className="w-12 p-1 border text-center  ">кол-во</td>
                        <td className="w-32 p-1 border text-center  ">часов</td>
                        <td className="w-12 p-1 border text-center  ">кол-во</td>
                        <td className="w-32 p-1 border text-center  ">часов</td>
                    </tr>
                    </thead>
                    <tbody>
                    {filterListOfPeople.map((el, index) => {
                        const user_rank = rank.find(obj => obj.id === el.rank_id);
                        const user_guest = user.user_group_sub_id.indexOf(el.real_group_id) === -1;
                        const user_edited = user.profile.find(el => el.page === 'overtime' && el.action === 'edit');
                        let group_name = getNameToGroupList(el.group_id, group);
                        group_name = group_name[group_name.length - 1];

                        const user_overtime = listOvertime.find(obj => obj.user_id === el.id);

                        const duty_workday_count = user_overtime ? user_overtime.duty_workday_count : 0;
                        const duty_workday_hours = user_overtime ? user_overtime.duty_workday_hours : 0;

                        const duty_weekends_count = user_overtime ? user_overtime.duty_weekends_count : 0;
                        const duty_weekends_hours = user_overtime ? user_overtime.duty_weekends_hours : 0;
                        const duty_total = (duty_workday_hours + duty_weekends_hours) / 8;

                        const without_restrictions_count = user_overtime ? user_overtime.without_restrictions_count : 0;
                        const without_restrictions_total = user_overtime ? user_overtime.without_restrictions_total : 0;

                        const dcoo_count = user_overtime ? user_overtime.dcoo_count : 0;
                        const dcoo_total = user_overtime ? user_overtime.dcoo_total : 0;

                        const other_hours = user_overtime ? user_overtime.other_hours : 0;
                        const other_total = user_overtime ? user_overtime.other_total : 0;

                        const month_duty_total = Number(duty_total) + Number(without_restrictions_total) +
                            Number(dcoo_total) + Number(other_total);

                        const realize_duty_workday = user_overtime ? user_overtime.realize_duty_workday : 0;
                        const realize_duty_holiday = user_overtime ? user_overtime.realize_duty_holiday : 0;
                        const realize_duty_by_money = user_overtime ? user_overtime.realize_duty_by_money : 0;

                        const month_total = Number(month_duty_total) -
                            (Number(realize_duty_workday) + Number(realize_duty_holiday) + Number(realize_duty_by_money));
                        const total_overtime_last_month = user_overtime ? user_overtime.total_overtime_last_month : 0;

                        const total_overtime = Number(month_total) + Number(total_overtime_last_month);

                        if (colorTrigger.colorTrigger === '5' && month_total <= 5) return;
                        if (colorTrigger.colorTrigger === '10' && month_total <= 10) return;

                        return <tr
                            key={el.id}
                            className={clsx({
                                "bg-gray-400": user_guest
                            })}>
                            <td className="w-12 p-1 border">{index + 1}</td>
                            <td className="w-32 p-1 border">{group_name}</td>
                            <td className="w-32 p-1 border">{user_rank ? user_rank.abbr : ''}</td>
                            <td className="w-56 p-1 border">{el.name}</td>
                            <td className="w-56 p-1 border">{el.phone}</td>

                            <td className="w-56  p-1 border">{duty_workday_count}</td>
                            <td className="w-56  p-1 border">{duty_workday_hours}</td>
                            <td className="w-56  p-1 border">{duty_weekends_count}</td>
                            <td className="w-56  p-1 border">{duty_weekends_hours}</td>
                            <td className="w-56  p-1 border">{(duty_total).toFixed(1)}</td>

                            <td className="w-56  p-1 border">

                                <input
                                    className={clsx("w-12",
                                        {
                                            "rounded border outline-none w-full h-full border-blue-700 p-1": user_edited,
                                            "bg-gray-400": user_guest
                                        },
                                    )}
                                    onChange={(e) => {
                                        user_edited && inputHandler(e, user_overtime, 'without_restrictions_count')
                                    }}
                                    value={without_restrictions_count}
                                />
                            </td>
                            <td className="w-56  p-1 border">
                                <input
                                    className={clsx("w-12",
                                        {
                                            "rounded border outline-none w-full h-full border-blue-700 p-1": user_edited,
                                            "bg-gray-400": user_guest
                                        },
                                    )}
                                    onChange={(e) => {
                                        user_edited && inputHandler(e, user_overtime, 'without_restrictions_total')
                                    }}
                                    value={without_restrictions_total}
                                />
                            </td>

                            <td className="w-56  p-1 border">
                                <input
                                    className={clsx("w-12",
                                        {
                                            "rounded border outline-none w-full h-full border-blue-700 p-1": user_edited,
                                            "bg-gray-400": user_guest
                                        },
                                    )}
                                    onChange={(e) => {
                                        user_edited && inputHandler(e, user_overtime, 'dcoo_count')
                                    }}
                                    value={dcoo_count}
                                />
                            </td>
                            <td className="w-56  p-1 border">
                                <input
                                    className={clsx("w-12",
                                        {
                                            "rounded border outline-none w-full h-full border-blue-700 p-1": user_edited,
                                            "bg-gray-400": user_guest
                                        },
                                    )}
                                    onChange={(e) => {
                                        user_edited && inputHandler(e, user_overtime, 'dcoo_total')
                                    }}
                                    value={dcoo_total}
                                />
                            </td>

                            <td className="w-56  p-1 border">
                                <input
                                    className={clsx("w-12",
                                        {
                                            "rounded border outline-none w-full h-full border-blue-700 p-1": user_edited,
                                            "bg-gray-400": user_guest
                                        },
                                    )}
                                    onChange={(e) => {
                                        user_edited && inputHandler(e, user_overtime, 'other_hours')
                                    }}
                                    value={other_hours}
                                />
                            </td>
                            <td className="w-56  p-1 border">
                                <input
                                    className={clsx("w-12",
                                        {
                                            "rounded border outline-none w-full h-full border-blue-700 p-1": user_edited,
                                            "bg-gray-400": user_guest
                                        },
                                    )}
                                    onChange={(e) => {
                                        user_edited && inputHandler(e, user_overtime, 'other_total')
                                    }}
                                    value={other_total}
                                />
                            </td>

                            <td className="w-56  p-1 border">{(month_duty_total).toFixed(1)}</td>

                            <td className="w-56  p-1 border">{realize_duty_workday}</td>
                            <td className="w-56  p-1 border">
                                <input
                                    className={clsx("w-12",
                                        {
                                            "rounded border outline-none w-full h-full border-blue-700 p-1": user_edited,
                                            "bg-gray-400": user_guest
                                        },
                                    )}
                                    onChange={(e) => {
                                        user_edited && inputHandler(e, user_overtime, 'realize_duty_holiday')
                                    }}
                                    value={realize_duty_holiday}
                                />
                            </td>
                            <td className="w-56  p-1 border">
                                <input
                                    className={clsx("w-12",
                                        {
                                            "rounded border outline-none w-full h-full border-blue-700 p-1": user_edited,
                                            "bg-gray-400": user_guest
                                        },
                                    )}
                                    onChange={(e) => {
                                        user_edited && inputHandler(e, user_overtime, 'realize_duty_by_money')
                                    }}
                                    value={realize_duty_by_money}
                                />
                            </td>

                            <td className={clsx("w-56  p-1 border",
                                {"bg-yellow-500": month_total > 5 && month_total <= 10},
                                {"bg-red-500": month_total > 10}
                            )}>{(month_total).toFixed(1)}</td>
                            <td className="w-56  p-1 border">
                                <input
                                    className={clsx("w-12",
                                        {
                                            "rounded border outline-none w-full h-full border-blue-700 p-1": user_edited,
                                            "bg-gray-400": user_guest
                                        },
                                    )}
                                    onChange={(e) => {
                                        user_edited && inputHandler(e, user_overtime, 'total_overtime_last_month')
                                    }}
                                    value={total_overtime_last_month}
                                />
                            </td>
                            <td className="w-56  p-1 border">{(total_overtime).toFixed(1)}</td>

                        </tr>
                    })}
                    </tbody>
                </table>
            }
        </div>
    )
}
