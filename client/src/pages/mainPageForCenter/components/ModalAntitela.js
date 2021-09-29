//core
import React from 'react'
import clsx from "clsx";
import DatePicker from "react-datepicker";
import {registerLocale} from "react-datepicker";
import ru from "date-fns/locale/ru";

//components
import MyModal from "../../../components/modal/Modal";
import Button, {InputForDatePicker} from "../../../components/Button";

//functions
import workWithServer from "../../../core/workWithServer";

import {from_date_format, from_date_format_st} from "../../../core/localWorkWithDate";

registerLocale("ru", ru);

export default function ModalAntitela({antitela}) {
    if (!antitela) return null


    const antitelaObj = antitela.listOfAntitela
        ? antitela.listOfAntitela.find(a => a.userForControl_id === antitela.antitelaModal.id)
        : null;

    let coronaObj = antitela.listOfCoronaDayData
        ? antitela.listOfCoronaDayData.filter(a => a.userForControl_id === antitela.antitelaModal.id)
        : [];

    coronaObj = coronaObj[coronaObj.length - 1];

    return (
        <MyModal show={antitela.showAntitela} showModal={antitela.setShowAntitela}>
            <div className="border-b m-1 mb-4 p-2 flex">
                    <span className="my-auto">
                        {antitela.antitelaModal.name}
                    </span>
            </div>
            {
                coronaObj && <p className="text-center text-red-500">
                    Имуннитет преобретен {from_date_format_st(new Date(coronaObj.date))}
                </p>
            }
            {
                antitela.objectAntitelaModal.editModal
                    ? <>
                        <p className="my-2">Номер справки:</p>
                        <input
                            className={clsx("p-1 w-full border bg-white rounded outline-none", {
                                'border-red-700 text-red-900 text-red-900': antitela.antitelaError.indexOf('comment') !== -1,
                                'border-blue-700': antitela.antitelaError.indexOf('comment') === -1,
                            })}
                            value={antitela.objectAntitelaModal.comment}
                            placeholder="Укажите номер справки..."
                            onChange={(e) => {
                                antitela.setAntitelaError([...antitela.antitelaError.filter(el => el !== 'comment')]);
                                antitela.setObjectAntitelaModal({...antitela.objectAntitelaModal, comment: e.target.value})
                            }}
                        />
                    <p className="my-2">Дополнительная информация:</p>
                        <textarea
                            className={clsx("p-1 w-full border bg-white rounded outline-none border-blue-700")}
                            value={antitela.objectAntitelaModal.comment2}
                            placeholder="Укажите содержание справки..."
                            onChange={(e) => {
                                antitela.setObjectAntitelaModal({...antitela.objectAntitelaModal, comment2: e.target.value})
                            }}
                        />
                        <p className="my-2">Дата стравки:</p>
                        <DatePicker
                            className={
                                clsx("w-full rounded border ", {
                                    'border-red-700 text-red-900': antitela.antitelaError.indexOf('date') !== -1,
                                    'border-blue-700': antitela.antitelaError.indexOf('date') === -1,
                                })
                            }
                            selected={
                                antitela.objectAntitelaModal.date
                                    ? new Date(antitela.objectAntitelaModal.date)
                                    : null
                            }
                            onChange={
                                date => {
                                    antitela.setObjectAntitelaModal({
                                        ...antitela.objectAntitelaModal,
                                        date: (date && new Date(date.setHours(5)))
                                    });

                                    antitela.setAntitelaError([...antitela.antitelaError.filter(el => el !== 'date')]);
                                }
                            }
                            dateFormat="dd.MM.yyyy"
                            customInput={<InputForDatePicker/>}
                            isClearable
                            showWeekNumbers
                            locale="ru"
                            placeholderText="Дата..."
                        />
                        <div className="flex">
                            <Button
                                className="my-4 mx-0 w-full text-center"
                                type="success"
                                text="Сохранить"
                                onClick={() => {
                                    let error_list = [];

                                    if (!antitela.objectAntitelaModal.date) {
                                        error_list.push('date')
                                    }
                                    if (antitela.objectAntitelaModal.comment.trim().length === 0) {
                                        error_list.push('comment')
                                    }
                                    if (error_list.length !== 0) {
                                        antitela.setAntitelaError(error_list);
                                        return;
                                    }
                                    workWithServer.setOneAntitela({
                                        'data': antitela.objectAntitelaModal
                                    }).then(data => {
                                        antitela.setListOfAntitela(data.antitela);
                                    });
                                    antitela.setShowAntitela(false);
                                }}/>
                            {
                                antitela.objectAntitelaModal.id && <>
                                    < div className="w-1/2 ml-1 flex">
                                        <Button
                                            className="my-4 mx-0 w-full text-center"
                                            type="danger"
                                            text="Удалить"
                                            onClick={() => {
                                                workWithServer.setOneAntitela({
                                                    'data': antitela.objectAntitelaModal,
                                                    'remove': true
                                                }).then(data => {
                                                    antitela.setListOfAntitela(data.antitela);
                                                });
                                                antitela.setShowAntitela(false);
                                            }}
                                        />
                                    </div>
                                </>
                            }
                        </div>
                    </>
                    : antitelaObj
                        ? <>
                            <p className="p-2">Справка: {antitelaObj.comment}</p>
                            <p className="p-2">Содержание справки: {antitelaObj.comment2}</p>
                            <p className="p-2">Дата: {from_date_format_st(new Date(antitelaObj.date))}</p>
                        </>
                        : null
            }

        </MyModal>
    )
}
