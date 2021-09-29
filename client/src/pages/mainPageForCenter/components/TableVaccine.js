//core
import React from 'react'
import Moment from "react-moment";
import clsx from "clsx";

//functions
import {compareDate, from_date_format, from_date_format_st, isDayNotNormal} from "../../../core/localWorkWithDate";
import {getFirst, getLast, getVaccineStatus} from "../../../core/localWorkWithList";

export default function TableVaccine({filterListOfPeople, arrWithDate, report, rank, vaccine, antitela, holiday, modal, user, status, date}) {
    const group_vaccine = vaccine.listOfVaccine.reduce((acc, val) => {
        if (acc[val.userForControl_id]) {
            acc[val.userForControl_id] += 1
        } else {
            acc[val.userForControl_id] = 1
        }
        acc.count = Math.max(acc.count, acc[val.userForControl_id]);
        return acc
    }, {
        count: 0,
        vaccine: {}
    });
    const max_count_vaccine = new Array(group_vaccine.count).fill(0);
    return (
        <div>
            {filterListOfPeople.length === 0 ?
                <p className="text-center text-2xl">По вашему запросу ничего не найдено</p>
                :
                <table className="m-2 overflow-x-auto w-full">
                    <thead>
                    <tr className="">
                        <td className="w-12 p-1 text-center sticky top-0 bg-white" style={{
                            boxShadow: '0 0 0 1px rgba(215, 224, 232, 0.5)'
                        }}
                        >
                            №
                        </td>
                        <td className="w-32 p-1 text-center sticky top-0 bg-white" style={{
                            boxShadow: '0 0 0 1px rgba(215, 224, 232, 0.5)'
                        }}
                        >
                            Звание
                        </td>
                        <td className="w-56 p-1 text-center sticky top-0 bg-white" style={{
                            boxShadow: '0 0 0 1px rgba(215, 224, 232, 0.5)'
                        }}
                        >
                            ФИО
                        </td>
                        {
                            max_count_vaccine.map((_, index) => {
                                return <td className="p-1 text-center sticky top-0 bg-white" style={{
                                    boxShadow: '0 0 0 1px rgba(215, 224, 232, 0.5)'
                                }}
                                >
                                    Вакцина {index + 1}
                                </td>
                            })
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
                        const user_rank = rank.find(obj => obj.id === el.rank_id);
                        const vaccineArr = vaccine.listOfVaccine.filter(vac => vac.userForControl_id === el.id);
                        const lastVaccineObj = getLast(vaccineArr);
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
                            {
                                max_count_vaccine.map((_, index) => {
                                    let result = '-';
                                    if (Array.isArray(vaccineArr) && vaccineArr.length > index) {
                                        const vaccine = vaccineArr[index];
                                        result = vaccine.second_date
                                            ? from_date_format(new Date(vaccine.second_date))
                                            : from_date_format(new Date(vaccine.first_date))
                                    }
                                    return <td className="p-2 text-center border"
                                    >
                                        {result}
                                    </td>
                                })
                            }
                            <td
                                className={clsx("p-01 border w-12 text-center align-middle cursor-default cursor-pointer", {
                                    'bg-green-200': !!vaccineArr.length && !!vaccineObj_success,
                                    'bg-yellow-200': !!vaccineArr.length && !vaccineObj_success,
                                })}
                                onClick={() => {
                                    vaccine.vaccine_modal(el, vaccineArr);
                                }}
                            >
                                {!!vaccineArr.length
                                    ? (lastVaccineObj.second_date
                                        ? from_date_format(new Date(lastVaccineObj.second_date))
                                        : from_date_format(new Date(lastVaccineObj.first_date)))
                                    : ''}

                            </td>
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
