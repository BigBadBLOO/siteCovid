//core
import React from 'react'
import Moment from "react-moment";
import clsx from "clsx";

//functions
import {compareDate, from_date_format, from_date_format_st, isDayNotNormal} from "../../../core/localWorkWithDate";
import {getFirst, getLast, getVaccineStatus} from "../../../core/localWorkWithList";

export default function Table({filterListOfPeople, arrWithDate, report, rank, vaccine, antitela, holiday, modal, user, status, date}) {
    return (
        <div>
            {filterListOfPeople.length === 0 ?
                <p className="text-center text-2xl">По вашему запросу ничего не найдено</p>
                :
                <table className="m-2 overflow-x-auto">
                    <thead>
                    <tr className="">
                        <td className="w-12 p-1 text-center sticky top-0 bg-white" style={{
                            boxShadow: '0 0 0 1px rgba(215, 224, 232, 0.5)'
                        }}>№
                        </td>
                        <td className="w-32 p-1 text-center sticky top-0 bg-white" style={{
                            boxShadow: '0 0 0 1px rgba(215, 224, 232, 0.5)'
                        }}>Звание
                        </td>
                        <td className="w-56 p-1 text-center sticky top-0 bg-white" style={{
                            boxShadow: '0 0 0 1px rgba(215, 224, 232, 0.5)'
                        }}>ФИО
                        </td>
                        {
                            arrWithDate.map((el, index) => <td
                                className={clsx("p-1 text-center align-middle sticky top-0 bg-white", {
                                    'bg-red-200 bg-opacity-50': isDayNotNormal(el, holiday),
                                    'bg-blue-200 bg-opacity-50': compareDate(el, date.curr) === 0,
                                })}
                                style={{
                                    boxShadow: '0 0 0 1px rgba(215, 224, 232, 0.5)'
                                }}
                                key={index}
                            >
                                <Moment format="DD">{el}</Moment>
                            </td>)
                        }
                        <td
                            className="w-32 p-1 text-center sticky top-0 bg-white"
                            style={{
                                boxShadow: '0 0 0 1px rgba(215, 224, 232, 0.5)'
                            }}
                        >Вакцина</td>
                        <td className="w-32 p-1 text-center sticky top-0 bg-white"
                            style={{
                                boxShadow: '0 0 0 1px rgba(215, 224, 232, 0.5)'
                            }}
                        >Заболевшие</td>
                    </tr>
                    </thead>
                    <tbody>
                    {filterListOfPeople.map((el, index) => {
                        const listReportByPerson = report.listOfReport.filter(obj => obj.userForControl_id === el.id);
                        const user_rank = rank.find(obj => obj.id === el.rank_id);
                        const vaccineObj = vaccine.listOfVaccine.filter(vac => vac.userForControl_id === el.id);

                        const lastVaccineObj = getLast(vaccineObj);
                        const vaccineObj_success = getVaccineStatus(lastVaccineObj);
                        const antitelaObj = antitela.listOfAntitela.find(a => a.userForControl_id === el.id);

                        let coronaObj = null;
                        if (!antitelaObj) {
                            coronaObj = antitela.listOfCoronaDayData.filter(a => a.userForControl_id === el.id);
                            coronaObj = coronaObj[coronaObj.length - 1];
                        }
                        return <tr
                            key={el.id}
                            className={clsx({
                                "bg-gray-400": user.user_group_sub_id.indexOf(el.real_group_id) === -1
                            })}>
                            <td className="w-12 p-1 border">{index + 1}</td>
                            <td className="w-32 p-1 border">{user_rank ? user_rank.abbr : ''}</td>
                            <td className="w-56  p-1 border">{el.name}</td>
                            {arrWithDate.map(date_el => {
                                let elem = listReportByPerson.find(obj => compareDate(obj.date + " 05:00", date_el) === 0);
                                let elem_status = status.find(obj => obj.id === (elem ? elem.status_id : null));
                                let activePoint = ((user.user_group_sub_id.indexOf(el.real_group_id) !== -1 && compareDate(date_el, date.curr) > -1) || elem);
                                return <td key={date_el.toLocaleString()}
                                           className={clsx("p-01 border w-12 text-center align-middle cursor-default", {
                                               'bg-red-200 bg-opacity-25': isDayNotNormal(date_el, holiday),
                                               'bg-blue-200 bg-opacity-25': compareDate(date_el, date.curr) === 0,
                                               'cursor-pointer': activePoint
                                           })}
                                           onClick={() => {
                                               if (activePoint) {
                                                   modal.modal(el, elem, date_el);
                                               }
                                           }}
                                >
                                        <span
                                            className={clsx({
                                                'text-red-600': !elem_status || (!!elem_status && !elem_status['with_work']),
                                                'text-green-600': !!elem_status && elem_status['with_work'],
                                            })}
                                        >
                                            {!!elem
                                                ? (!!elem_status
                                                    ? elem_status['abbr']
                                                    : elem_status['name'].substr(0, 1))
                                                : (isDayNotNormal(date_el, holiday) ? '' : '-')}
                                        </span>
                                </td>
                            })}

                            <td
                                className={clsx("p-01 border w-12 text-center align-middle cursor-default cursor-pointer", {
                                    'bg-green-200': !!vaccineObj.length && !!vaccineObj_success,
                                    'bg-yellow-200': !!vaccineObj.length && !vaccineObj_success,
                                })}
                                onClick={() => {
                                    vaccine.vaccine_modal(el, vaccineObj);
                                }}
                            >
                                {!!vaccineObj.length
                                    ? (lastVaccineObj.second_date
                                        ? from_date_format(new Date(lastVaccineObj.second_date))
                                        : from_date_format(new Date(lastVaccineObj.first_date)))
                                    : ''}

                            </td>

                            {/*<td*/}
                            {/*className={clsx("p-01 border w-12 text-center align-middle cursor-default cursor-pointer", {*/}
                            {/*'bg-green-200': !!vaccineObj_2*/}
                            {/*})}*/}
                            {/*onClick={() => {*/}
                            {/*vaccine.vaccine_modal(el, vaccineObj_2);*/}
                            {/*}}*/}
                            {/*>*/}
                            {/*{vaccineObj_2*/}
                            {/*? from_date_format_st(*/}
                            {/*!!vaccineObj_2.second_date*/}
                            {/*? new Date(vaccineObj_2.second_date)*/}
                            {/*: new Date(vaccineObj_2.first_date))*/}
                            {/*: ''}*/}

                            {/*</td>*/}

                            <td className={clsx("p-01 border w-12 text-center align-middle cursor-default cursor-pointer", {
                                'bg-green-200': coronaObj || antitelaObj
                            })}
                                onClick={() => {
                                    antitela.antitela_modal(el, antitelaObj);
                                }}
                            >
                                {
                                    coronaObj || antitelaObj
                                        ? from_date_format_st(
                                        antitelaObj
                                            ? new Date(antitelaObj.date)
                                            : new Date(coronaObj.date)
                                        )
                                        : ''
                                }
                            </td>
                        </tr>
                    })}
                    </tbody>
                </table>
            }
        </div>
    )
}
