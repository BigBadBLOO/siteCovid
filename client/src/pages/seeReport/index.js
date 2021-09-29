//core
import React, {createRef, useEffect, useState} from "react";
import {connect} from "react-redux";
import DatePicker from "react-datepicker";
import Moment from "react-moment";

//components
import Button, {InputForDatePicker} from "../../components/Button";

//functions
import workWithServer from "../../core/workWithServer";
import {getSubList, getElemFromObj, getLevelObj, getVaccineStatus} from "../../core/localWorkWithList";
import {getNameToGroup} from "../../core/localWorkWithGroup";
import {from_date_format_st} from "../../core/localWorkWithDate";
import {get_bos_info, person_on_work} from "../../core/localWorkWithActivity";

//styles
import "react-datepicker/dist/react-datepicker.css";

function SeeReport({user, group, person, rank, post, status, headerRef, myReload}) {
    const [startDate, setStartDate] = useState(new Date());
    const printRef = createRef();

    const [listOfReport, setListOfReport] = useState([]);
    const [listOfVaccine, setListOfVaccine] = useState([]);
    const [listOfAntitela, setListOfAntitela] = useState([]);
    const [listOfCoronaDayData, setListOfCoronaDayData] = useState([]);
    const [spb, setSpb] = useState({
        'military': 0,
        'persons': 0,
        'covid': 0,
        'pnevmania': 0,
        'orv': 0,
        'noInfection': 0,
        'carantin': 0,
        '65+': 0
    });
    const [priozersk, setPriozersk] = useState({});
    const [listOfDataForDayData, setListOfDataForDayData] = useState([]);
    const user_permission = user.profile.find(el => el.action === 'get_all_user');
    const userGroupSub = user_permission ? getLevelObj(user.user_group_sub) : user.user_group_sub;
    const userGroupSubId = user_permission ? getElemFromObj(group) : user.user_group_sub_id;


    const [listOfCity, setListOfCity] = useState([]);

    const getListOfReports = () => {
        workWithServer.getListOfCity().then(data => {
            setListOfCity(data)
        });
        workWithServer.getListOfReport({'date': startDate, 'includeExtraFields': true}).then(data => {
            setListOfReport(data.report);
            setListOfVaccine(data.vaccine);
            setListOfAntitela(data.antitela);
            setListOfCoronaDayData(data.corona_daydata);
            setListOfDataForDayData(data.extraDataForDayData);
        });
    };

    useEffect(() => {
        getListOfReports();
    }, [startDate, myReload]);


    const onWorkAll = person.filter(el => {
        return person_on_work(el, listOfReport, status);
    });


    const [boss, setBoss] = useState({});

    useEffect(() => {
        setBoss(get_bos_info(post, onWorkAll, rank, group, listOfReport, status));
    }, [listOfReport]);

    const onWorkMilitary = onWorkAll.filter(el => el.is_military);
    const onWorkPeople = onWorkAll.filter(el => !el.is_military);

    const onWorkMilitaryWithChildren = onWorkMilitary.filter(el => el.is_woman_with_children);
    const onWorkPeopleWithChildren = onWorkPeople.filter(el => el.is_woman_with_children);

    let withDisease = person.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        if (!user_permission) {
            return !!el_status && !el_status.with_work;
        }
        else {
            return !!el_status && userGroupSubId.indexOf(el.real_group_id) !== -1;
        }
    });

    const onRemoteWork = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Удаленная работа';
    });

    const withNoInfectionAmb = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Неинфекционное заболевание, амбулаторно';
    });

    const withNoInfectionStat = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Неинфекционное заболевание, стационарно';
    });

    const withPnevmoniaAmb = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Пневмония, амбулаторно';
    });

    const withPnevmoniaStat = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Пневмония, стационарно';
    });

    const withRespiratornoAmb = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Респираторное заболевание, амбулаторно';
    });

    const withRespiratornoStat = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Респираторное заболевание, стационарно';
    });

    const withKarantin = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Карантин';
    });

    const with65 = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === '65+';
    });

    const withCovidAmb = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Коронавирус, амбулаторно';
    });

    const withCovidStat = withDisease.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Коронавирус, стационарно';
    });

    withDisease = [...withNoInfectionAmb, ...withNoInfectionStat, ...withPnevmoniaAmb, ...withPnevmoniaStat,
        ...withRespiratornoAmb, ...withRespiratornoStat, ...withKarantin, ...withCovidAmb, ...withCovidStat];


    const withVaccine = person.filter(el => {
        const el_vaccine = listOfVaccine.find(obj => obj.userForControl_id === el.id);
        return !!el_vaccine;
    });

     const withManyVaccine = withVaccine.filter(el => {
        const el_vaccine = listOfVaccine.filter(obj => obj.userForControl_id === el.id);
        return el_vaccine.length > 1;
    });

    const withAntitela = person.filter(el => {
        const el_antitela = listOfAntitela.find(obj => obj.userForControl_id === el.id);
        if (el_antitela) return true;
        const el_corona = listOfCoronaDayData.find(obj => obj.userForControl_id === el.id);
        return !!el_corona
    });

    const withMix = person
        .filter(el => {
            const el_antitela = listOfAntitela.find(obj => obj.userForControl_id === el.id);
            if (el_antitela) return true;
            const el_corona = listOfCoronaDayData.find(obj => obj.userForControl_id === el.id);
            if (el_corona) return true;
            const el_vaccine = listOfVaccine.find(obj => obj.userForControl_id === el.id);
            return !!el_vaccine
        });

    return (
        <>
            <div ref={printRef}>
                <Button className="" type='primary' text="Распечатать" onClick={() => {
                    printRef.current.classList.add('hidden');
                    headerRef.current.classList.add('hidden');
                    window.print();
                    printRef.current.classList.remove('hidden');
                    headerRef.current.classList.remove('hidden');
                }}/>
                {!user_permission &&
                <DatePicker
                    className="w-24 m-2 border-blue-700 rounded border"
                    selected={startDate}
                    onChange={setStartDate}
                    showWeekNumbers
                    locale="ru"
                    dateFormat="dd.MM.yyyy"
                    customInput={<InputForDatePicker/>}
                />
                }
            </div>

            <div className="m-4">
                <div className="float-right" style={{marginLeft: '100%'}}>
                    <p className="text-center p-1">Начальник ФГКУ "12 ЦНИИ"<br/> Минобороны России</p>
                    <p className="text-right p-1">_________________________________</p>
                </div>
                <p className="text-center">
                    СПРАВКА-ДОКЛАД <br/>
                    о состоянии дел в
                    {user_permission ?
                        <> ФГКУ "12 ЦНИИ" Минобороны России<br/></>
                        :
                        <> {!!user.user_group ? getNameToGroup(user.user_group, group) : ''}<br/></>
                    }
                    на {startDate.toLocaleString("ru")}
                </p>
                <p className="font-bold">
                    1. Находятся на службе:
                </p>
                <p>
                    Всего <b>{onWorkAll.length}</b>, в том числе: <br/>
                    военнослужащие - <b>{onWorkMilitary.length}</b> чел., из них женщин с детьми до 14 лет
                    - {onWorkMilitaryWithChildren.length} чел. <br/>
                    гражданские - <b>{onWorkPeople.length}</b> чел., из них женщин с детьми до 14 лет
                    - {onWorkPeopleWithChildren.length} чел.
                </p>
                <table className="mt-1 text-center text-xs break-words w-full">
                    <tr className="" style={{pageBreakInside: 'avoid'}}>
                        <td rowSpan={2} className="border p-1">ППД</td>
                        <td rowSpan={2} className="border p-1">Военнослужащие</td>
                        <td rowSpan={2} className="border p-1">Гр. персонал</td>
                        <td rowSpan={2} className="border p-1">Covid</td>
                        <td colSpan={2} className="border p-1">Инфекционные заболевания</td>
                        <td rowSpan={2} className="border p-1">Неинфекционные (другие) заболевания</td>
                        <td rowSpan={2} className="border p-1">Карантин</td>
                        <td rowSpan={2} className="border p-1">65+</td>
                        <td rowSpan={2} className="border p-1">Удаленная работа</td>
                    </tr>
                    <tr style={{pageBreakInside: 'avoid'}}>
                        <td className="border p-1">Пневмония</td>
                        <td className="border p-1">ОРВ</td>
                    </tr>
                    {listOfCity.map(el => {
                        return (
                            <tr style={{pageBreakInside: 'avoid'}}>
                                <td className="border p-1">{el.name}</td>
                                <td className="border p-1">
                                    {onWorkMilitary.filter(obj => obj.city_id === el.id).length}
                                </td>
                                <td className="border p-1">
                                    {onWorkPeople.filter(obj => obj.city_id === el.id).length}
                                </td>
                                <td className="border p-1">
                                    {withCovidStat.filter(obj => obj.city_id === el.id).length + withCovidAmb.filter(obj => obj.city_id === el.id).length}
                                </td>
                                <td className="border p-1">
                                    {withPnevmoniaAmb.filter(obj => obj.city_id === el.id).length + withPnevmoniaStat.filter(obj => obj.city_id === el.id).length}
                                </td>
                                <td className="border p-1">
                                    {withRespiratornoAmb.filter(obj => obj.city_id === el.id).length + withRespiratornoStat.filter(obj => obj.city_id === el.id).length}
                                </td>
                                <td className="border p-1">
                                    {withNoInfectionAmb.filter(obj => obj.city_id === el.id).length + withNoInfectionStat.filter(obj => obj.city_id === el.id).length}
                                </td>
                                <td className="border p-1">
                                    {withKarantin.filter(obj => obj.city_id === el.id).length}
                                </td>
                                <td className="border p-1">
                                    {with65.filter(obj => obj.city_id === el.id).length}
                                </td>
                                <td className="border p-1">
                                    {onRemoteWork.filter(obj => obj.city_id === el.id).length}
                                </td>
                            </tr>
                        )
                    })}
                    <tr className="font-bold" style={{pageBreakInside: 'avoid'}}>
                        <td className="border p-1">Итого</td>
                        <td className="border p-1">{onWorkMilitary.length}</td>
                        <td className="border p-1">{onWorkPeople.length}</td>
                        <td className="border p-1">{withCovidStat.length + withCovidAmb.length}</td>
                        <td className="border p-1">{withPnevmoniaAmb.length + withPnevmoniaStat.length}</td>
                        <td className="border p-1">{withRespiratornoAmb.length + withRespiratornoStat.length}</td>
                        <td className="border p-1">{withNoInfectionAmb.length + withNoInfectionStat.length}</td>
                        <td className="border p-1">{withKarantin.length}</td>
                        <td className="border p-1">{with65.length}</td>
                        <td className="border p-1">{onRemoteWork.length}</td>
                    </tr>
                </table>

                <p className="mt-2">
                    <b>2. Число заболевших:</b>
                </p>

                <table className="mt-1 text-center text-xs break-words w-full">
                    <tr style={{pageBreakInside: 'avoid'}}>
                        <td rowSpan={3} className="border p-1 w-1/6">Подразделения</td>
                        <td rowSpan={2} colSpan={3} className="border p-1 w-1/6">Covid</td>
                        <td colSpan={6} className="border p-1 w-1/6">Инфекционные заболевания</td>
                        <td rowSpan={2} colSpan={3} className="border p-1 w-1/6">Неинфекционные (другие) заболевания
                        </td>
                        <td rowSpan={2} colSpan={3} className="border p-1 w-1/6">Карантин</td>
                    </tr>
                    <tr style={{pageBreakInside: 'avoid'}}>
                        <td colSpan={3} className="border p-1">Пневмония</td>
                        <td colSpan={3} className="border p-1">ОРВИ</td>
                    </tr>
                    <tr style={{pageBreakInside: 'avoid'}}>
                        {repeatBlock(<>
                            <td className="border p-1">Всл.</td>
                            <td className="border p-1">ГП</td>
                            <td className="border p-1">Итого</td>
                        </>, 5)}
                    </tr>
                    {userGroupSub.map(el => {
                        let el_gloupList = [];
                        if (user_permission) {
                            el_gloupList = getElemFromObj(getSubList(el, group))
                        } else {
                            el_gloupList = [el.id];
                        }

                        const withCovid = [...withCovidAmb.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1),
                            ...withCovidStat.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1)];
                        const withPnevmania = [...withPnevmoniaAmb.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1),
                            ...withPnevmoniaStat.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1)];
                        const withOrv = [...withRespiratornoAmb.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1),
                            ...withRespiratornoStat.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1)];
                        const withOther = [...withNoInfectionAmb.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1),
                            ...withNoInfectionStat.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1)];
                        const karantin = [...withKarantin.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1)];
                        return (
                            <tr style={{pageBreakInside: 'avoid'}}>
                                <td className="border p-1">{getNameToGroup(el, group)}</td>
                                {filterBlock(withCovid)}
                                {filterBlock(withPnevmania)}
                                {filterBlock(withOrv)}
                                {filterBlock(withOther)}
                                {filterBlock(karantin)}
                            </tr>
                        )
                    })}
                    <tr className="font-bold" style={{pageBreakInside: 'avoid'}}>
                        <td className="border p-1">Итого</td>
                        {filterBlock([...withCovidAmb, ...withCovidStat])}
                        {filterBlock([...withPnevmoniaAmb, ...withPnevmoniaStat])}
                        {filterBlock([...withRespiratornoAmb, ...withRespiratornoStat])}
                        {filterBlock([...withNoInfectionAmb, ...withNoInfectionStat])}
                        {filterBlock(withKarantin)}
                    </tr>
                </table>

                <p className="mt-2">
                    Всего - <b>{withDisease.length}</b> <br/>
                    в том числе:
                </p>
                <p className="font-bold text-center mt-8">
                    Коронавирусная инфекция - {withCovidAmb.length + withCovidStat.length} чел.
                    ({withCovidAmb.filter(el => el.is_military).length + withCovidStat.filter(el => el.is_military).length}
                    в/сл,
                    {withCovidAmb.filter(el => !el.is_military).length + withCovidStat.filter(el => !el.is_military).length}
                    гп)
                </p>
                <div className="mt-1 text-center text-xs">
                    {makeTableHeader()}
                    <p className="font-bold text-center border p-1">Стационар</p>
                    {makeTableData(withCovidStat, rank, group, listOfReport, listOfDataForDayData)}
                    <p className="font-bold text-center border p-1">Амбулаторно</p>
                    {makeTableData(withCovidAmb, rank, group, listOfReport, listOfDataForDayData)}
                </div>
                <p className="font-bold text-center mt-8">
                    Пневмония - {withPnevmoniaAmb.length + withPnevmoniaStat.length} чел.
                    ({withPnevmoniaAmb.filter(el => el.is_military).length + withPnevmoniaStat.filter(el => el.is_military).length}
                    в/сл,
                    {withPnevmoniaAmb.filter(el => !el.is_military).length + withPnevmoniaStat.filter(el => !el.is_military).length}
                    гп)
                </p>
                <div className=" mt-1 text-center text-xs">
                    {makeTableHeader()}
                    <p className="font-bold text-center border p-1">Стационар</p>
                    {makeTableData(withPnevmoniaStat, rank, group, listOfReport, listOfDataForDayData)}
                    <p className="font-bold text-center border p-1">Амбулаторно</p>
                    {makeTableData(withPnevmoniaAmb, rank, group, listOfReport, listOfDataForDayData)}
                </div>
                <p className="font-bold text-center mt-8">
                    Острые респираторные вирусные инфекции (не коронавирусная
                    инфекция) - {withRespiratornoStat.length + withRespiratornoAmb.length} чел.
                    ({withRespiratornoStat.filter(el => el.is_military).length + withRespiratornoAmb.filter(el => el.is_military).length}
                    в/сл,
                    {withRespiratornoStat.filter(el => !el.is_military).length + withRespiratornoAmb.filter(el => !el.is_military).length}
                    гп)
                </p>
                <div className="mt-1 text-center text-xs">
                    {makeTableHeader()}
                    <p className="font-bold text-center border p-1">Стационар</p>
                    {makeTableData(withRespiratornoStat, rank, group, listOfReport, listOfDataForDayData)}
                    <p className="font-bold text-center border p-1">Амбулаторно</p>
                    {makeTableData(withRespiratornoAmb, rank, group, listOfReport, listOfDataForDayData)}
                </div>

                <p className="font-bold text-center ">
                    Неинфекционные (другие) заболевания - {withNoInfectionAmb.length + withNoInfectionStat.length} чел.
                    ({withNoInfectionAmb.filter(el => el.is_military).length + withNoInfectionStat.filter(el => el.is_military).length}
                    в/сл,
                    {withNoInfectionAmb.filter(el => !el.is_military).length + withNoInfectionStat.filter(el => !el.is_military).length}
                    гп)
                </p>
                <div className="mt-1 text-center text-xs">
                    {makeTableHeader()}
                    <p className="font-bold text-center border p-1">Стационар</p>
                    {makeTableData(withNoInfectionStat, rank, group, listOfReport, listOfDataForDayData)}
                    <p className="font-bold text-center border p-1">Амбулаторно</p>
                    {makeTableData(withNoInfectionAmb, rank, group, listOfReport, listOfDataForDayData)}
                </div>
                <p className="font-bold text-center mt-8">
                    Карантин - {withKarantin.length} чел.
                    ({withKarantin.filter(el => el.is_military).length} в/сл,
                    {withKarantin.filter(el => !el.is_military).length} гп)
                </p>
                <div className="mt-1 text-center text-xs">
                    {makeTableHeader()}
                    {makeTableData(withKarantin, rank, group, listOfReport, listOfDataForDayData)}
                </div>

                <p className="font-bold text-center mt-8">
                    Вакцинация - {withVaccine.length} чел.
                    ({withVaccine.filter(el => el.is_military).length} в/сл,
                    {withVaccine.filter(el => !el.is_military).length} гп)
                </p>
                <table className="mt-1 text-center text-xs break-words w-full">
                    <tr style={{pageBreakInside: 'avoid'}}>
                        <td rowSpan={2} className="border p-1 w-1/6">Подразделения</td>
                        <td rowSpan={1} colSpan={3} className="border p-1 w-2/6">Вакцинация</td>
                        <td rowSpan={1} colSpan={3} className="border p-1 w-2/6">Переболело</td>
                        <td rowSpan={2} className="border p-1 w-1/6"> Коллективный иммунитет</td>
                    </tr>
                    <tr style={{pageBreakInside: 'avoid'}}>
                        {repeatBlock(<>
                            <td className="border p-1">Всл.</td>
                            <td className="border p-1">ГП</td>
                            <td className="border p-1">Итого</td>
                        </>, 2)}
                    </tr>
                    {userGroupSub.map(el => {
                        let el_gloupList = getElemFromObj(getSubList(el, group));

                        const vaccine = withVaccine.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1);
                        const antitela = withAntitela.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1);
                        const mix = person
                            .filter(person => el_gloupList.indexOf(person.real_group_id) !== -1)
                            .filter(el => {
                                const el_antitela = listOfAntitela.find(obj => obj.userForControl_id === el.id);
                                if (el_antitela) return true;
                                const el_corona = listOfCoronaDayData.find(obj => obj.userForControl_id === el.id);
                                if (el_corona) return true;
                                const el_vaccine = listOfVaccine.find(obj => obj.userForControl_id === el.id);
                                return !!el_vaccine
                            });

                        const personsByGroup = person.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1);
                        return (
                            <tr style={{pageBreakInside: 'avoid'}}>
                                <td className="border p-1">{getNameToGroup(el, group)}</td>
                                {filterBlock(vaccine)}
                                {filterBlock(antitela)}
                                <td className="border p-1">{
                                    personsByGroup.length > 0
                                        ? Math.ceil(mix.length * 100 / personsByGroup.length)
                                        : 0
                                }%
                                </td>
                            </tr>
                        )
                    })}
                    <tr className="font-bold" style={{pageBreakInside: 'avoid'}}>
                        <td className="border p-1">Итого</td>
                        {filterBlock(withVaccine)}
                        {filterBlock(withAntitela)}
                        <td className="border p-1">{
                            person.length > 0
                                ? Math.ceil(withMix.length * 100 / person.length)
                                : 0
                        }%
                        </td>
                    </tr>
                </table>

                <p className="font-bold text-center mt-8">
                    Ревакцинация - {withManyVaccine.length} чел.
                    ({withManyVaccine.filter(el => el.is_military).length} в/сл,
                    {withManyVaccine.filter(el => !el.is_military).length} гп)
                </p>
                <table className="mt-1 text-center text-xs break-words w-full">
                    <tr style={{pageBreakInside: 'avoid'}}>
                        <td rowSpan={2} className="border p-1 w-1/6">Подразделения</td>
                        <td rowSpan={1} colSpan={3} className="border p-1 w-3/6">Ревакцинация</td>
                        <td rowSpan={2} className="border p-1 w-1/6">Процент ревакцинированных</td>
                    </tr>
                    <tr style={{pageBreakInside: 'avoid'}}>
                        <td className="border p-1">Всл.</td>
                        <td className="border p-1">ГП</td>
                        <td className="border p-1">Итого</td>
                    </tr>
                    {userGroupSub.map(el => {
                        let el_gloupList = getElemFromObj(getSubList(el, group));
                        const vaccine = withVaccine.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1);
                        const vaccineMany= withManyVaccine.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1);

                        const personsByGroup = person.filter(person => el_gloupList.indexOf(person.real_group_id) !== -1);
                        return (
                            <tr style={{pageBreakInside: 'avoid'}}>
                                <td className="border p-1">{getNameToGroup(el, group)}</td>
                                {filterBlock(vaccineMany)}
                                <td className="border p-1">{
                                    personsByGroup.length > 0
                                        ? Math.ceil(vaccineMany.length * 100 / vaccine.length)
                                        : 0
                                }%
                                </td>
                            </tr>
                        )
                    })}
                    <tr className="font-bold" style={{pageBreakInside: 'avoid'}}>
                        <td className="border p-1">Итого</td>
                        {filterBlock(withManyVaccine)}
                        <td className="border p-1">{
                            person.length > 0
                                ? Math.ceil(withManyVaccine.length * 100 / withVaccine.length)
                                : 0
                        }%
                        </td>
                    </tr>
                </table>


                <div className="mt-4 text-left">
                    {user_permission
                        ?
                        <>
                            {/*<div style={{pageBreakBefore: 'always'}}>*/}
                            {makePersonSignature('Помощник дежурного по институту')}
                            {makePersonSignature('Начальник медицинской службы института', 'капитан медицинской службы', 'Е. Савельев')}
                            {group.filter(el => el.signature).map(el => makePersonSignature(getNameToGroup(el, group)))}
                            {/*</div>*/}
                        </>
                        :
                        <>
                            <input className="mt-2 w-full" placeholder="Должность"
                                   value={!!boss ? boss['post_id__name'] : ''}
                                   onChange={e => setBoss({...boss, 'post_id__name': e.target.value})}/>
                            <div>
                                <input placeholder="Звание" value={!!boss ? boss['rank_id__name'] : ''}
                                       className="w-1/6 lowercase"
                                       onChange={e => setBoss({...boss, 'rank_id__name': e.target.value})}/>
                                <input placeholder="И.Фамилия" value={!!boss ? boss['name'] : ''}
                                       className="float-right text-right w-1/6"
                                       onChange={e => setBoss({...boss, 'name': e.target.value})}/>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    );


    function makePersonSignature(group_name, rank, user) {
        return (
            <div className="w-full" style={{pageBreakInside: 'avoid'}}>
                <p>{group_name}</p>


                <Moment format="DD.MM.YYYY">{startDate}</Moment>

                {!!user &&
                <>
                    <span className="float-right">
                        {!!rank &&
                        <>
                            <span className="mr-64">
                        {rank}
                        </span>
                        </>
                        }
                        {user}
                    </span>
                </>
                }

                <div className="w-full border-b border-black"></div>
                <p className="text-right">
                    <pre>подпись    инициал имени, фамилия</pre>
                </p>

            </div>
        )
    }


}

function mapStateToProps(state) {
    return {
        user: state.user,
        group: state.group,
        person: state.person,
        rank: state.rank,
        post: state.post,
        status: state.status,
    }
}

export default connect(mapStateToProps)(SeeReport);


function makeTableData(mass, rank, group, listOfReport, listOfDataForDayData) {
    return (
        mass.length > 0
            ? mass.map((el, index) => {
                let el_rank = rank.find(obj => obj.id === el.rank_id);
                let el_group = group.find(obj => obj.id === el.real_group_id);
                let el_report = listOfReport.find(obj => obj.userForControl_id === el.id);

                let extraFields = listOfDataForDayData.filter(obj => obj.data_id === (!!el_report ? el_report.id : null))


                let t = extraFields.find(el => el.name === 't');
                let covid_test = extraFields.find(el => el.name === 'test');
                let covid_test_date = extraFields.find(el => el.name === 'test_date');
                let covid_test_result = extraFields.find(el => el.name === 'test_result');
                let covid_test_result_date = extraFields.find(el => el.name === 'test_result_date');

                return (
                    <div className="flex break-words" style={{pageBreakInside: 'avoid'}}>
                        <p className="border p-1 inline-block" style={{width: "5%"}}>{index + 1}</p>
                        <p className="border p-1 inline-block" style={{width: "12%"}}>{getNameToGroup(el_group, group)}</p>
                        <p className="border p-1 inline-block" style={{width: "13%"}}>{!!el_rank ? el_rank.abbr : 'гп'}</p>
                        <p className="border p-1 inline-block w-3/12">{el.name}</p>
                        <p className="border p-1 inline-block w-6/12 text-left">

                            {!!t ? <p>{'Температура: ' + t.value}</p> : ''}

                            {!!covid_test || !!covid_test_date ?
                                <p>
                                    {'Тест на Covid: ' + (!!covid_test ? covid_test.value : '') +
                                    (!!covid_test_date ? ' ' + covid_test_date.value : '')}
                                </p> : ''}

                            {!!covid_test_result || !!covid_test_result_date ?
                                <p>
                                    {'Результат теста на Covid: ' + (!!covid_test_result ? covid_test_result.value : '') +
                                    (!!covid_test_result_date ? ' ' + covid_test_result_date.value : '')}
                                </p> : ''}


                            {!!el_report && !!el_report.comment && <>{'Комментарий: '}{el_report.comment}</>}
                        </p>
                    </div>
                )
            })
            : <p className="text-center border p-1"> Отсутствуют</p>
    )
}

function makeTableVaccine(mass, rank, group, listOfVaccine) {
    return (
        mass.length > 0
            ?
            mass.map((el, index) => {
                let el_rank = rank.find(obj => obj.id === el.rank_id);
                let el_group = group.find(obj => obj.id === el.real_group_id);
                let el_vaccine = listOfVaccine.find(obj => obj.userForControl_id === el.id);

                return (
                    <div className="flex break-words" style={{pageBreakInside: 'avoid'}}>
                        <p className="border p-1 inline-block" style={{width: "5%"}}>{index + 1}</p>
                        <p className="border p-1 inline-block"
                           style={{width: "12%"}}>{getNameToGroup(el_group, group)}</p>
                        <p className="border p-1 inline-block"
                           style={{width: "13%"}}>{!!el_rank ? el_rank.abbr : 'гп'}</p>
                        <p className="border p-1 inline-block w-3/12">{el.name}</p>
                        <p className="border p-1 inline-block w-6/12 text-left">
                            <p>{'Дата первой вакцинации: ' + from_date_format_st(new Date(el_vaccine.first_date))}</p>
                            {!!el_vaccine.second_date &&
                            <p>{'Дата повторной вакцинации: ' + from_date_format_st(new Date(el_vaccine.second_date))}</p>}
                            <p>{'Комментарий: ' + el_vaccine.comment}</p>
                        </p>
                    </div>
                )
            })
            : <p className="text-center border p-1"> Отсутствуют</p>
    )
}

function makeTableHeader() {
    return (
        <div className="flex break-words" style={{pageBreakInside: 'avoid'}}>
            <p className="border p-1 inline-block" style={{width: "5%"}}> №</p>
            <p className="border p-1 inline-block" style={{width: "12%"}}> Подразделение</p>
            <p className="border p-1 inline-block" style={{width: "13%"}}> Воинское звание</p>
            <p className="border p-1 inline-block w-3/12"> Фамилия, инициалы</p>
            <p className="border p-1 inline-block w-6/12"> Комментарии</p>
        </div>
    )
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

function filterBlock(mass) {
    return <>
        <td className="border p-1">{mass.filter(el => el.is_military).length}</td>
        <td className="border p-1">{mass.filter(el => !el.is_military).length}</td>
        <td className="border p-1">{mass.length}</td>
    </>
}