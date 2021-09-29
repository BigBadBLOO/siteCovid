//core
import React from 'react'
import clsx from "clsx";
import DatePicker from "react-datepicker";
import {registerLocale} from "react-datepicker";
import ru from "date-fns/locale/ru";
import moment from "moment";

//components
import MyModal from "../../../components/modal/Modal";
import Button, {InputForDatePicker} from "../../../components/Button";

//functions
import workWithServer from "../../../core/workWithServer";
import {from_date_format_hm} from "../../../core/localWorkWithDate";

import {get_int, get_two} from "../../../core/localWorkWithNumber";

registerLocale("ru", ru);


export default function ModalCell({modal, status, date, report, duty}) {

    return (
        <MyModal show={modal.show} showModal={modal.setShow}>
            <div className="border-b m-1 mb-4 p-2 flex">
                    <span className="my-auto">
                        {modal.personModal.name} ({from_date_format_hm(modal.objectModal.date)})
                    </span>
            </div>
            {
                modal.objectModal.editModal
                    ? (
                        <>
                            <p className="my-2">Выберите статус:</p>
                            <select
                                className="w-full h-full border-b border-blue-700 bg-white"
                                value={modal.objectModal.status_id}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    let comment = value ? modal.objectModal.comment : '';
                                    const el = modal.workWithStatus({
                                        ...modal.objectModal,
                                        status_id: Number(value),
                                        comment: comment
                                    }, {});
                                    modal.setObjectModal(el);
                                    let one_status = status.find(el => el.id === parseInt(value));
                                    if (!!one_status && one_status.workDay) {
                                        modal.setEndDateForModal(null)
                                    }
                                }}
                            >
                                <option value="">Сбросить статус</option>
                                {
                                    (modal.objectModal.workDay
                                            ? status.filter(el => !el.parent_id)
                                            : status.filter(el => !el.parent_id).filter(el => !el.workDay)
                                    )
                                    // .filter(el => el.name !== 'Наряд')
                                    .map(el => <option key={el.id} value={el.id}>{el.name}</option>)
                                }
                            </select>
                        </>
                    )
                    : (
                        <>
                            <p className="my-2">Cтатус:</p>
                            <p className="w-full h-full border-b border-blue-700 bg-white">
                                {status.filter(el => el.id === modal.objectModal.status_id).map(el => el.name)}
                            </p>
                        </>
                    )
            }
            {
                modal.extraStatus.length > 0
                && <>
                    {
                        modal.objectModal.editModal
                            ? <>
                                <p className="my-2">Выберите доп статус:</p>
                                <select
                                className="w-full h-full border-b border-blue-700 bg-white"
                                    value={modal.objectModal.extra_status_id}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const el = modal.workWithStatus({
                                            ...modal.objectModal,
                                            status_id: Number(value),
                                            extra_status_id: Number(value),
                                        }, {});
                                        modal.setObjectModal(el)
                                    }}>
                                    {modal.extraStatus.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
                                </select>
                            </>
                            : <>
                                {modal.objectModal.extra_status_id !== null &&
                                <>
                                    <p className="my-2">Доп статус:</p>
                                    <p className="w-full h-full border-b border-blue-700 bg-white">
                                        {status.filter(el => el.id === modal.objectModal.extra_status_id).map(el => el.name)}
                                    </p>
                                </>}
                            </>
                    }
                </>
            }
            {
                modal.showExtraFields && <>
                    {
                        modal.objectModal.editModal
                            ? <>
                                <p className="my-2">Температура тела:</p>
                                <input
                                    className={clsx("p-1 w-full border bg-white rounded outline-none", {
                                        'border-red-700 text-red-900': modal.showError.indexOf('t') !== -1,
                                        'border-blue-700': modal.showError.indexOf('t') === -1,
                                    })}
                                    value={modal.extraFields.t}
                                    placeholder="Температура тела..."
                                    onKeyPress={(event) => {
                                        if ((event.which !== 46) && (event.which < 48 || event.which > 57)) {
                                            event.preventDefault();
                                        }
                                    }}
                                    onChange={(e) => {
                                        modal.setShowError([...modal.showError.filter(el => el !== 't')]);
                                        modal.setExtraFields({...modal.extraFields, t: e.target.value})
                                    }}
                                />
                            </>
                            : !!modal.extraFields.t && <>
                            <p className="my-2">Температура тела:</p>
                            <p className="p-1 w-full border border-blue-700 bg-white rounded outline-none">
                                {modal.extraFields.t}
                            </p>
                        </>
                    }
                </>
            }

            {
                modal.objectModal.editModal && <>
                    <p className="my-2">По какое число:</p>
                    <DatePicker
                        className={clsx("w-full rounded border ", {
                            'border-red-700 text-red-900': modal.showError.indexOf('endDateForModal') !== -1,
                            'border-blue-700': modal.showError.indexOf('endDateForModal') === -1,
                        })}
                        selected={modal.endDateForModal}
                        onChange={
                            date => {
                                let one_status = status.find(el => el.id === modal.objectModal.status_id);
                                if (!!one_status && one_status.workDay) {
                                    modal.setEndDateForModal(null)
                                } else {
                                    modal.setEndDateForModal(date && new Date(date.setHours(5)))
                                }
                                modal.setShowError([...modal.showError.filter(el => el !== 'endDateForModal')]);
                            }
                        }
                        dateFormat="dd.MM.yyyy"
                        customInput={<InputForDatePicker/>}
                        isClearable
                        showWeekNumbers
                        locale="ru"
                        placeholderText="По какое число..."
                        minDate={modal.objectModal.date}
                    />
                </>
            }
            {
                modal.showExtraFields
                && !!(status.find(el => el.id === modal.objectModal.extra_status_id
                    && el.name.toLowerCase().indexOf('неинфекционное')))
                && <>
                    {
                        modal.objectModal.editModal
                            ? <>
                                <p className="my-2">Тест на Covid</p>
                                <div className="flex">
                                    <DatePicker
                                        className="border-blue-700 w-full rounded border"
                                        selected={modal.extraFields.test_date
                                            ? moment(modal.extraFields.test_date, "DD.MM.YYYY").toDate()
                                            : null
                                        }
                                        onChange={date => {
                                            modal.setExtraFields({
                                                ...modal.extraFields,
                                                test_date: date ? date.toLocaleDateString('ru') : ''
                                            })
                                        }}
                                        dateFormat="dd.MM.yyyy"
                                        customInput={<InputForDatePicker/>}
                                        isClearable
                                        showWeekNumbers
                                        locale="ru"
                                        placeholderText="Дата теста..."
                                    />
                                    <input
                                        className={clsx("w-full p-1 ml-2 border bg-white rounded outline-none", {
                                            'border-red-700 text-red-900': modal.showError.indexOf('test') !== -1,
                                            'border-blue-700': modal.showError.indexOf('test') === -1,
                                        })}
                                        value={modal.extraFields.test}
                                        placeholder="Комментарий..."
                                        onChange={(e) => {
                                            modal.setShowError([...modal.showError.filter(el => el !== 'test')]);
                                            modal.setExtraFields({...modal.extraFields, test: e.target.value})
                                        }}
                                    />
                                </div>
                            </>
                            :
                            (modal.extraFields.test_date || modal.extraFields.test)
                            && <>
                                <p className="my-2">Тест на Covid</p>
                                <div className="flex">
                                    <p className="rounded border border-blue-700 p-1 w-full">
                                        {modal.extraFields.test_date}
                                    </p>
                                    <p className="w-full p-1 ml-2 border border-blue-700 bg-white rounded outline-none">
                                        {modal.extraFields.test}
                                    </p>
                                </div>
                            </>
                    }
                    {
                        modal.objectModal.editModal
                            ? <>
                                <p className="my-2">Тест на Covid результат</p>
                                <div className="flex">
                                    <DatePicker
                                        className={clsx("w-full rounded border", {
                                            'border-red-700 text-red-900': modal.showError.indexOf('test_result_date') !== -1,
                                            'border-blue-700': modal.showError.indexOf('test_result_date') === -1,
                                        })}
                                        selected={modal.extraFields.test_result_date
                                            ? moment(modal.extraFields.test_result_date, "DD.MM.YYYY").toDate()
                                            : null
                                        }
                                        onChange={date => {
                                            modal.setExtraFields({
                                                ...modal.extraFields,
                                                test_result_date: date ? date.toLocaleDateString('ru') : ''
                                            });
                                            modal.setShowError([...modal.showError.filter(el => el !== 'test_result_date')]);
                                        }}
                                        dateFormat="dd.MM.yyyy"
                                        customInput={<InputForDatePicker/>}
                                        isClearable
                                        showWeekNumbers
                                        locale="ru"
                                        placeholderText="Дата результата теста..."
                                    />
                                    <input
                                        className={clsx("w-full p-1 ml-2 border bg-white rounded outline-none", {
                                            'border-red-700 text-red-900': modal.showError.indexOf('test_result') !== -1,
                                            'border-blue-700': modal.showError.indexOf('test_result') === -1,
                                        })}
                                        value={modal.extraFields.test_result} placeholder="Результат теста на Covid..."
                                        onChange={(e) => {
                                            modal.setShowError([...modal.showError.filter(el => el !== 'test_result')]);
                                            modal.setExtraFields({...modal.extraFields, test_result: e.target.value})
                                        }}
                                    />
                                </div>
                            </>
                            : (modal.extraFields.test_result_date || modal.extraFields.test_result)
                            && <>
                                <p className="my-2">Тест на Covid результат</p>
                                <div className="flex">
                                    <p className="rounded border border-blue-700 p-1 w-full">
                                        {modal.extraFields.test_result_date}
                                    </p>
                                    <p className="w-full p-1 ml-2 border border-blue-700 bg-white rounded outline-none">
                                        {modal.extraFields.test_result}
                                    </p>
                                </div>
                            </>
                    }
                </>
            }
            {
                modal.objectModal.editModal
                    ? (
                        <>
                            <p className="my-2">Комментарий:</p>
                            <textarea
                                className={clsx("p-1 w-full border bg-white rounded outline-none", {
                                    'border-red-700 text-red-900 text-red-900': modal.showError.indexOf('comment') !== -1,
                                    'border-blue-700': modal.showError.indexOf('comment') === -1,
                                })}
                                value={modal.objectModal.comment}
                                placeholder="Оставьте комментарий..." onChange={(e) => {
                                modal.setShowError([...modal.showError.filter(el => el !== 'comment')]);
                                modal.setObjectModal({...modal.objectModal, comment: e.target.value})
                            }}/>
                        </>
                    )
                    : (
                        <>
                            {
                                modal.objectModal.comment && <>
                                    <p className="my-2">Комментарий:</p>
                                    <p className="p-1 w-full border border-blue-700 bg-white rounded outline-none">
                                        {modal.objectModal.comment}
                                    </p>
                                </>
                            }
                        </>
                    )
            }
            {
                modal.showError.length !== 0 &&
                <p className="text-red-500 text-center">Вам необходимо корректно заполнить указанные поля</p>
            }
            {
                modal.objectModal.editModal && <>
                    <Button
                        className="my-4 mx-0 w-full text-center"
                        type="success"
                        text="Сохранить"
                        onClick={() => {
                            let el_status = status.find(obj => obj.id === modal.objectModal.status_id);
                            let error_list = [];

                            if(modal.extraStatus.length > 0 && (modal.objectModal.extra_status_id === null || !modal.objectModal.extra_status_id)){
                                modal.objectModal.extra_status_id = modal.extraStatus.map(el => el.id)[0];
                            }

                            if ('t' in modal.extraFields) {
                                if (!modal.extraFields.t) {
                                    error_list.push('t')
                                } else if (modal.extraFields.t.trim().length === 0) {
                                    error_list.push('t')
                                } else {
                                    let t = get_int(modal.extraFields.t);
                                    if (t >= 42 || t < 32) {
                                        error_list.push('t')
                                    }
                                }
                            }
                            if (!('fromDiseaseDate' in modal.extraFields)
                                && modal.objectModal.extra_status_id
                                && !modal.endDateForModal
                            ) {
                                error_list.push('endDateForModal')
                            }

                            if ('test_date' in modal.extraFields && !!modal.extraFields.test_date) {
                                if (!modal.extraFields.test) {
                                    error_list.push('test')
                                } else if (modal.extraFields.test.trim().length === 0) {
                                    error_list.push('test')
                                }
                                if (!modal.extraFields.test_result_date) {
                                    error_list.push('test_result_date')
                                }
                                if (!modal.extraFields.test_result) {
                                    error_list.push('test_result')
                                } else if (modal.extraFields.test_result.trim().length === 0) {
                                    error_list.push('test_result')
                                }
                            }
                            if (el_status && el_status.with_comment) {
                                if (!modal.objectModal.comment) {
                                    error_list.push('comment')
                                } else if (modal.objectModal.comment.trim().length === 0) {
                                    error_list.push('comment')
                                }
                            }

                            if (error_list.length !== 0) {
                                modal.setShowError(error_list);
                            } else {
                                const month = get_two(date.currDate.getMonth() + 1);
                                const day = get_two(modal.objectModal.date.getDate());
                                modal.objectModal.status_id = modal.objectModal.extra_status_id
                                    ? modal.objectModal.extra_status_id
                                    : modal.objectModal.status_id;
                                workWithServer.setOneReport({
                                    'data': modal.objectModal,
                                    'date': `${date.currDate.getFullYear()}-${month}-${day}`,
                                    'date_end': modal.endDateForModal,
                                    'extraFields': modal.extraFields,
                                    'main_date_begin': date.startDate,
                                    'main_date_end': date.endDate
                                }).then(data => {
                                    report.setListOfReport(data.report);
                                });
                                modal.setShow(false);
                                modal.setEndDateForModal(null);
                                modal.setShowError([]);
                            }
                        }}/>
                </>
            }
        </MyModal>
    )
}