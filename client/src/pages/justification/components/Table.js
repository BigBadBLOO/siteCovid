//core
import React from 'react'
import clsx from "clsx";
import moment from "moment";

//functions
import {getNameToGroupList} from "../../../core/localWorkWithGroup";
import {isDayNotNormal} from "../../../core/localWorkWithDate";


export default function Table({filterListOfPeople, rank, date, user, group, arrWithReport, status, holiday}) {
    const arrWithDate = date.arrWithDate.filter(d => !isDayNotNormal(d, holiday));
    return (
        <div>
            <table className="m-2 w-full overflow-x-auto">
                <thead className="">
                <tr className="">
                    <td className="w-12 p-1 border text-center" rowSpan="2">№</td>
                    <td className="w-12 p-1 border text-center" rowSpan="2">Подразделение</td>
                    <td className="w-12 p-1 border text-center" rowSpan="2">Воинское звание</td>
                    <td className="w-12 p-1 border text-center" rowSpan="2">Фамилия и инициалы</td>
                    <td className="p-1 border text-center" colSpan="3">Занятость</td>
                </tr>
                <tr className="">
                    <td className="p-1 border text-center">дата</td>
                    <td className="p-1 border text-center">статус</td>
                    <td className="p-1 border text-center">обоснование</td>
                </tr>
                </thead>
                <tbody>
                { filterListOfPeople.length === 0
                    ? <tr ><td className="text-center text-2xl" colSpan="7">По вашему запросу ничего не найдено</td></tr>
                    : filterListOfPeople.map((el, index) => {
                        const user_rank = rank.find(obj => obj.id === el.rank_id);
                        let group_name = getNameToGroupList(el.group_id, group);
                        group_name = group_name[group_name.length - 1];
                        const rowSpan = arrWithDate.length + 1;
                        const arrDate_jsx = arrWithDate.map(d => {
                            const report = arrWithReport
                                .filter(report => report.userForControl_id === el.id)
                                .find(report => report.date === moment(d).format('YYYY-MM-DD'));
                            const statusPerson = report ? status.find(st => st.id === report.status_id) : {name: ''};
                            const comment = report ? report.comment : '';
                            return <tr key={d.toLocaleString()}>
                                <td className={clsx("p-1 border", {'bg-red-200': !comment})}>{moment(d).format('DD-MM-YYYY')}</td>
                                <td className={clsx("p-1 border", {'bg-red-200': !comment})}>{statusPerson.name}</td>
                                <td className={clsx("p-1 border", {'bg-red-200': !comment})}>{comment}</td>
                            </tr>
                        });
                        if (arrDate_jsx.length === 0) return;
                        return <>
                        <tr
                            key={el.id}
                            className={clsx({
                                "bg-gray-400": user.user_group_sub_id.indexOf(el.real_group_id) === -1
                            })}>
                            <td className="p-1 border" rowSpan={rowSpan}>{index + 1}</td>
                            <td className="p-1 border truncate" rowSpan={rowSpan}>{group_name}</td>
                            <td className="p-1 border truncate" rowSpan={rowSpan}>{user_rank ? user_rank.abbr : ''}</td>
                            <td className="p-1 border truncate" rowSpan={rowSpan}>{el.name}</td>
                        </tr>
                        {arrDate_jsx}
                        </>
                    })}
                </tbody>
            </table>
        </div>
    )
}
