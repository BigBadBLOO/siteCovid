//core
import React, {createRef, useEffect, useState} from "react";
import {connect} from "react-redux";
import DatePicker from "react-datepicker";
import clsx from "clsx";

//components
import Button, {InputForDatePicker} from "../../components/Button";

//functions
import {getElemFromObj, getLevelObj, getSubList, getSumElemFromObj} from "../../core/localWorkWithList";
import workWithServer from "../../core/workWithServer";
import {getNameToGroup} from "../../core/localWorkWithGroup";
import {compareDate, from_date_format_st, get_human_month_im} from "../../core/localWorkWithDate";

//styles
import "react-datepicker/dist/react-datepicker.css";

function Statistics({user, person, group, headerRef, myReload}) {
    const dateToday = new Date();

    const [typeOfDate, setTypeOfDate] = useState('day');

    const [curDate, setCurDate] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const printRef = createRef();


    const userGroupSub = user.is_control ? getLevelObj(user.user_group_sub) : user.user_group_sub;
    const userGroupSubId = user.is_control ? getElemFromObj(userGroupSub) : user.user_group_sub_id;

    let personsList = person.filter(el => userGroupSubId.indexOf(el.real_group_id) !== -1);

    const [listOfReport, setListOfReport] = useState([]);
    const [listOfVaccine, setListOfVaccine] = useState([]);


    const [personsDisease, setPersonsDisease] = useState([]);
    const [withDiseaseStart, setWithDiseaseStart] = useState([]);
    const [withDiseaseEnd, setWithDiseaseEnd] = useState([]);
    const [withDiseaseNow, setWithDiseaseNow] = useState([]);
    const [withVaccine, setWithVaccine] = useState([]);


    const getListForStatistics = () => {
        workWithServer.getListOfReport({
            'date_begin': startDate,
            'date_end': endDate,
            'type_of_date': typeOfDate,
            'with_disease': true
        }).then(data => {
            setListOfReport(data.report);
            setListOfVaccine(data.vaccine);

        })
    };

    useEffect(() => {
        getListForStatistics();
    }, [startDate, endDate, myReload]);

    function correctDateChanger(date) {
        let date_c = new Date(date);
        let date_s = new Date(date);
        let date_e = new Date(date);

        switch (typeOfDate) {
            case 'day':
                date_c = new Date(date_c.getFullYear(), date_c.getMonth(), date_c.getDate(), 5);
                date_s = new Date(date_s.getFullYear(), date_s.getMonth(), date_s.getDate() - 1, 5);
                date_e = new Date(date_e.getFullYear(), date_e.getMonth(), date_e.getDate() + 1, 5);
                break;
            case 'week':
                date_c = new Date(date_c.getFullYear(), date_c.getMonth(), date_c.getDate() - date_c.getDay() + 1, 5);
                date_s = new Date(date_s.getFullYear(), date_s.getMonth(), date_s.getDate() - date_s.getDay(), 5);
                date_e = new Date(date_e.getFullYear(), date_e.getMonth(), date_e.getDate() - date_e.getDay() + 8, 5);
                break;
            case 'month':
                date_c = new Date(date_c.getFullYear(), date_c.getMonth(), 1, 5);
                date_s = new Date(date_s.getFullYear(), date_s.getMonth(), 0, 5);
                date_e = new Date(date_e.getFullYear(), date_e.getMonth() + 1, 0, 5);
                break;
            case 'year':
                date_c = new Date(date_c.getFullYear(), 0, 1, 5);
                date_s = new Date(date_s.getFullYear(), 0, 0, 5);
                date_e = new Date(date_e.getFullYear() + 1, 0, 1, 5);
                break;
            case 'all':
                date_c = dateToday;
                date_s = new Date(2020, 9, 0, 5);
                date_e = dateToday;
                break;
            default:
                break;
        }

        if (compareDate(date_e, dateToday) === 1) {
            date_e = dateToday;
        }

        setCurDate(date_c);
        setStartDate(date_s);
        setEndDate(date_e);
    }

    useEffect(() => {
        correctDateChanger(dateToday);
    }, [typeOfDate]);

    useEffect(() => {
        setPersonsDisease(find_disease_list(personsList));

        setWithDiseaseStart(personsDisease.filter(el => el.dis_start_count !== 0));
        setWithDiseaseEnd(personsDisease.filter(el => el.dis_end_count !== 0));
        setWithDiseaseNow(personsDisease.filter(el => el.dis_list.length !== 0 && el.dis_end_count === 0 && el.dis_start_count === 0));

        setWithVaccine(personsList.filter(el => {
            const el_vaccine = listOfVaccine.find(obj => obj.userForControl_id === el.id);

            return !!el_vaccine;
        }));
    }, [listOfVaccine, listOfReport]);

    function find_disease_list(array) {
        return array.map(el => {
            let old_status = undefined;
            let dis_list = [];

            let dis_start = null;
            let dis_end = null;

            let dis_start_count = 0;
            let dis_end_count = 0;

            let start = new Date(startDate);

            const el_report_list = listOfReport.filter(obj => obj.userForControl_id === el.id);

            while (compareDate(start, endDate) < 1) {

                const el_report = el_report_list.find(obj => compareDate(obj.date, start) === 0);

                if (!!el_report) {
                    if (old_status !== el_report.status_id) {
                        if (old_status === undefined) {
                            dis_end = el_report;
                        }

                        if (old_status === null) {
                            dis_start_count++;
                            dis_start = el_report;
                        }

                        if (!!old_status) {
                            dis_list.push({
                                dis_start: dis_start,
                                dis_end: dis_end
                            });
                            dis_start = el_report;
                            dis_start_count++;
                            dis_end_count++;
                        }

                        old_status = el_report.status_id;
                    } else {
                        dis_end = el_report;
                        old_status = el_report.status_id;
                    }
                } else {
                    if (old_status !== undefined && old_status !== null) {
                        dis_end_count++;
                        dis_list.push({
                            dis_start: dis_start,
                            dis_end: dis_end
                        })
                    }
                    old_status = null;
                }

                start = new Date(start.setDate(start.getDate() + 1))
            }
            if (!!dis_start || !!dis_end) {
                dis_list.push({
                    dis_start: dis_start,
                    dis_end: dis_end
                })
            }


            return {
                person: el,
                dis_start_count: dis_start_count,
                dis_end_count: dis_end_count,
                dis_list: dis_list
            };
        });
    }

    return (<>
    <div ref={printRef}>
        <Button className="" type='primary' text="Распечатать" onClick={() => {
            printRef.current.classList.add('hidden');
            headerRef.current.classList.add('hidden');
            window.print();
            printRef.current.classList.remove('hidden');
            headerRef.current.classList.remove('hidden');
        }}/>
        <select value={typeOfDate} className="w-36 h-full border-b border-blue-700 bg-white m-2 p-1"
                onChange={e => {
                    setTypeOfDate(e.target.value);
                }}>
            <option value="all">За все время</option>
            <option value="day">За день</option>
            <option value="week">За неделю</option>
            <option value="month">За месяц</option>
            <option value="year">За год</option>
        </select>
        <DatePicker
            className={clsx("w-24 m-2 rounded border", {
                'border-gray-900 bg-gray-400': typeOfDate === 'all',
                'border-blue-700': typeOfDate !== 'all',
            })}
            selected={curDate}
            onChange={date => {
                correctDateChanger(new Date(date));
            }}
            maxDate={dateToday}
            disabled={typeOfDate === 'all'}

            showWeekNumbers={typeOfDate === 'day' || typeOfDate === 'week'}

            showMonthYearPicker={typeOfDate === 'month'}
            showFullMonthYearPicker={typeOfDate === 'month'}

            showYearPicker={typeOfDate === 'year'}
            showFullYearPicker={typeOfDate === 'year'}


            locale="ru"
            dateFormat={typeOfDate === 'month' ? 'MM.yy' : (typeOfDate === 'year' ? 'yyyy' : 'dd.MM.yyyy')}
            customInput={<InputForDatePicker/>}
        />
    </div>
    <div className="m-4">
        <div className="float-right" style={{marginLeft: '100%'}}>
            <p className="text-center p-1">Начальник ФГКУ "12 ЦНИИ"<br/> Минобороны России</p>
            <p className="text-right p-1">_________________________________</p>
        </div>
        <p className="text-center">
            СТАТИСТИКА <br/>
            заболеваемости в
            {!user.is_control &&
            <> {!!user.user_group ? getNameToGroup(user.user_group, group) : ''}<br/></>
            }
            {!!user.is_control &&
            <> ФГКУ "12 ЦНИИ" Минобороны России<br/></>
            }
            {typeOfDate === 'all' && 'за все время'}
            {typeOfDate === 'day' && 'за ' + from_date_format_st(curDate)}
            {/*{typeOfDate === 'week' && 'с ' + from_date_format_st(curDate) + ' по ' + from_date_format_st(endDate.setDate(endDate.getDate() - 1))}*/}
            {typeOfDate === 'month' && 'за ' + get_human_month_im(curDate.getMonth()) + ' ' + curDate.getFullYear() + ' года'}
            {typeOfDate === 'year' && 'за ' + curDate.getFullYear() + ' год'}
        </p>
    </div>

    <table className="mt-1 text-center text-xs break-words w-full">
        <tr style={{pageBreakInside: 'avoid'}}>
            <td rowSpan={2} className="border p-1 w-1/6">Подразделения</td>
            <td colSpan={3} className="border p-1 w-1/6">Болеет</td>
            <td colSpan={3} className="border p-1 w-1/6">Заболело</td>
            <td colSpan={3} className="border p-1 w-1/6">Выздоровело</td>
            <td colSpan={3} className="border p-1 w-1/6">Прошло вакцинацию</td>
        </tr>

        <tr style={{pageBreakInside: 'avoid'}}>
            {repeatBlock(<>
            <td className="border p-1">Всл.</td>
            <td className="border p-1">ГП</td>
            <td className="border p-1">Итого</td>
            </>, 4)}
        </tr>
        {userGroupSub.map(el => {

            let el_gloupList = [];
            if (user.is_control) {
                el_gloupList = getElemFromObj(getSubList(el, group))
            } else {
                el_gloupList = [el.id];
            }

            let withDiseaseNowLocal = [...withDiseaseNow.filter(obj => el_gloupList.indexOf(obj.person.real_group_id) !== -1)];
            let withDiseaseStartLocal = [...withDiseaseStart.filter(obj => el_gloupList.indexOf(obj.person.real_group_id) !== -1)];
            let withDiseaseEndLocal = [...withDiseaseEnd.filter(obj => el_gloupList.indexOf(obj.person.real_group_id) !== -1)];
            let withVaccineLocal = [...withVaccine.filter(obj => el_gloupList.indexOf(obj.real_group_id) !== -1)];
            return (
                <tr style={{pageBreakInside: 'avoid'}}>
                    <td className="border p-1">{getNameToGroup(el, group)}</td>
                    {filterBlockMod(withDiseaseNowLocal)}
                    {filterBlockMod(withDiseaseStartLocal, 'dis_start_count')}
                    {filterBlockMod(withDiseaseEndLocal, 'dis_end_count')}
                    {filterBlock(withVaccineLocal)}
                </tr>
            )
        })}
        <tr className="font-bold" style={{pageBreakInside: 'avoid'}}>
            <td className="border p-1">Итого</td>
            {filterBlockMod(withDiseaseNow)}
            {filterBlockMod(withDiseaseStart, 'dis_start_count')}
            {filterBlockMod(withDiseaseEnd, 'dis_end_count')}
            {filterBlock(withVaccine)}
        </tr>
    </table>

    </>)
}

function mapStateToProps(state) {
    return {
        user: state.user,
        group: state.group,
        person: state.person
    }
}

export default connect(mapStateToProps)(Statistics);

function filterBlock(mass) {
    return <>
    <td className="border p-1">{mass.filter(el => el.is_military).length}</td>
    <td className="border p-1">{mass.filter(el => !el.is_military).length}</td>
    <td className="border p-1">{mass.length}</td>
    </>
}

function filterBlockMod(mass, key) {
    return <>
    <td className="border p-1">{getSumElemFromObj(mass.filter(el => el.person.is_military), key)}</td>
    <td className="border p-1">{getSumElemFromObj(mass.filter(el => !el.person.is_military), key)}</td>
    <td className="border p-1">{getSumElemFromObj(mass, key)}</td>
    </>
}

function repeatBlock(block, count) {
    const mass = [];
    let i = 0;
    while (i < count) {
        mass.push(block);
        i++
    }
    return mass
}

