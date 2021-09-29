//core
import React, {createRef, useEffect, useState} from "react";
import {connect} from "react-redux";
import DatePicker from "react-datepicker";
import clsx from "clsx";

//components
import Button, {InputForDatePicker} from "../../components/Button";

//functions
import workWithServer from "../../core/workWithServer";
import {get_int} from "../../core/localWorkWithNumber";
import {getNameToGroup} from "../../core/localWorkWithGroup";
import {get_bos_info} from "../../core/localWorkWithActivity";

//styles
import "react-datepicker/dist/react-datepicker.css";

function ListOfRecords({user, person, status, rank, post, group, headerRef, myReload}) {
    const [startDate, setStartDate] = useState(new Date());
    const [typeOfState, setTypeOfState] = useState(1);
    const [listOfReport, setListOfReport] = useState([]);
    const [boss, setBoss] = useState({});

    const printRef = createRef();
    const user_is_editor = user.profile.find(el => el.page === 'listOfRecords' && el.action === 'edit');
    let personsList = person.filter(el => user.user_group_sub_id.indexOf(el.group_id) !== -1);
    const listOfPerson = personsList.filter(el => !el.is_military);
    const listOfMil = personsList.filter(el => el.is_military);

    useEffect(() => {
        setBoss(get_bos_info(post, listOfMil, rank, group, listOfReport, status));
    }, [person, listOfReport, status, rank, group, post]);


    const [countOfState, setCountOfState] = useState(0);

    useEffect(() => {
        setCountOfState(typeOfState === 1
            ? user.user_group.countMilByGroup
            : (typeOfState === 0
                ? user.user_group.countByGroup
                : user.user_group.countMilByGroup + user.user_group.countByGroup))
    }, [user]);

    const [listOfWork, setListOfWork] = useState([]);

    useEffect(() => {
        setListOfWork(typeOfState === 1
            ? listOfMil
            : (typeOfState === 0
                ? listOfPerson
                : personsList))
    }, [person]);

    const typeOfStateList = [{'value': 1, 'name': 'Военнослужащие'},
        {'value': 0, 'name': 'Гр. персонал'},
        {'value': -1, 'name': 'Все'}];

    const getListOfReport = () => {
        workWithServer.getListOfReport({'date': startDate, 'includeExtraFields': true}).then(data => {
            setListOfReport(data.report)
        })
    };

    useEffect(() => {
        getListOfReport()
    }, [myReload, startDate]);


    const onWorkAll = listOfWork.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.with_work;
    });

    const inOtherGroup = listOfWork.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !el_status || el_status.with_work;
    }).filter(el => user.user_group_sub_id.indexOf(el.real_group_id) === -1);

    const notWorks = listOfWork.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return (!!el_status && !el_status.with_work) || !el_status;
    });

    const naryad = notWorks.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));
        const el_status_parent = el_status && status.find(el => el.id === el_status.parent_id);
        return el_status && el_status_parent && el_status_parent.name === 'Наряд';
    });

    const komandirovka = notWorks.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Командировка';
    });

    const weekend = notWorks.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.name === 'Отпуск';
    });

    const withDesease = notWorks.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));

        return !!el_status && el_status.with_disease;
    });

    return (
        <>
            <div ref={printRef}>
                <div className="flex">
                    <Button className="" type='primary' text="Распечатать" onClick={() => {
                        printRef.current.classList.add('hidden');
                        headerRef.current.classList.add('hidden');
                        window.print();
                        printRef.current.classList.remove('hidden');
                        headerRef.current.classList.remove('hidden');
                    }}/>
                    <DatePicker
                        className="w-24 m-2 border-blue-700 rounded border "
                        selected={startDate}
                        onChange={setStartDate}
                        showWeekNumbers
                        locale="ru"
                        dateFormat="dd.MM.yyyy"
                        customInput={<InputForDatePicker/>}
                    />
                </div>
                <div className="flex">
                    <select className="m-2 rounded border outline-none border-blue-700 bg-white p-1"
                            value={typeOfState}
                            onChange={(e) => {
                                setTypeOfState(parseInt(e.target.value));
                                setCountOfState(parseInt(e.target.value) === 1
                                    ? user.user_group.countMilByGroup
                                    : (parseInt(e.target.value) === 0
                                        ? user.user_group.countByGroup
                                        : user.user_group.countMilByGroup + user.user_group.countByGroup));
                                setListOfWork(parseInt(e.target.value) === 1
                                    ? listOfMil
                                    : (parseInt(e.target.value) === 0
                                        ? listOfPerson
                                        : personsList))
                            }}>
                        {typeOfStateList.map(el => <option value={el.value}>{el.name}</option>)}
                    </select>

                    <input className={clsx("m-2 w-20 text-center outline-none rounded border p-1", {
                        'border-gray-900 bg-gray-400': typeOfState === -1,
                        'border-blue-700': typeOfState !== -1,
                    })}
                           placeholder="По штату"
                           value={countOfState}
                           disabled={!user_is_editor}
                           onBlur={e => {
                               if (!!user_is_editor) {
                                   const value = get_int(e.target.value.substr(0, 4));
                                   if (typeOfState !== -1) {
                                       workWithServer
                                           .setCountByGroup({'id': user.group_id, 'type': typeOfState, 'value': value})
                                           .then((e) => {
                                               e = get_int(e);
                                               setCountOfState(e);
                                               if (!!typeOfState) {
                                                   user.user_group.countMilByGroup = e;
                                               } else {
                                                   user.user_group.countByGroup = e;
                                               }
                                           })
                                   }
                               }
                           }
                           }
                           onChange={e => {
                               const value = get_int(e.target.value.substr(0, 4));
                               if (typeOfState !== -1) {
                                   setCountOfState(value)
                               }
                           }}
                    />
                </div>
            </div>


            <div className="m-4">
                <p className="text-center font-bold">РАЗВЕРНУТАЯ СТРОЕВАЯ ЗАПИСКА</p>

                <p className="text-center font-bold">
                    {user_is_editor ? getNameToGroup(user.user_group, group) : ''} на {startDate.toLocaleDateString('ru')} г.
                </p>
                <br/>

                <table className="mt-1 text-center text-xs break-words w-full">
                    <tr className="font-bold">
                        <td className="border p-1">№ п/п</td>
                        <td className="border p-1">Подразделение</td>
                        <td className="border p-1">По штату</td>
                        <td className="border p-1">По списку</td>
                        <td className="border p-1">В строю</td>
                        <td className="border p-1">Отсутствует</td>
                        <td className="border p-1">Наряд</td>
                        <td className="border p-1">Командировка</td>
                        <td className="border p-1">Отпуск</td>
                        <td className="border p-1">Болен</td>
                        <td className="border p-1">Прочее</td>
                    </tr>
                    <tr>
                        <td className="border p-1">1</td>
                        <td className="border p-1">{user.user_group.name}</td>
                        <td className="border p-1">{countOfState}</td>
                        <td className="border p-1">{listOfWork.length}</td>
                        <td className="border p-1">{onWorkAll.length}</td>
                        <td className="border p-1">{notWorks.length}</td>
                        <td className="border p-1">{naryad.length}</td>
                        <td className="border p-1">{komandirovka.length}</td>
                        <td className="border p-1">{weekend.length}</td>
                        <td className="border p-1">{withDesease.length}</td>
                        <td className="border p-1">
                            {notWorks.length - naryad.length - komandirovka.length - weekend.length - withDesease.length}
                        </td>
                    </tr>
                </table>
                <input className="mt-2 w-full" placeholder="Должность" value={!!boss ? boss['post_id__name'] : ''}
                       onChange={e => setBoss({...boss, 'post_id__name': e.target.value})}/>
                <div>
                    <input placeholder="Звание" value={!!boss ? boss['rank_id__name'] : ''} className="w-1/6 lowercase"
                           onChange={e => setBoss({...boss, 'rank_id__name': e.target.value})}/>
                    <input placeholder="И.Фамилия" value={!!boss ? boss['name'] : ''}
                           className="float-right text-right w-1/6"
                           onChange={e => setBoss({...boss, 'name': e.target.value})}/>
                </div>

                <div style={{pageBreakBefore: 'always'}}>
                    {inOtherGroup.length > 0 && <>
                        <p className="text-left font-bold ml-2">Направленные</p>
                        <table className="mt-1 text-center text-xs break-words w-full">
                            <tr className="font-bold">
                                <td className="border p-1">№ п/п</td>
                                <td className="border p-1">Воинское зван.</td>
                                <td className="border p-1">Фамилия, имя, отчество</td>
                                <td className="border p-1">Подразделение</td>
                                <td className="border p-1">Примечание</td>
                            </tr>

                            {inOtherGroup.map((el, index) => {
                                let el_rank = rank.find(obj => obj.id === el.rank_id);
                                let el_group = group.find(obj => obj.id === el.real_group_id);

                                return <tr className="text-left">
                                    <td className="border p-1">{index + 1}</td>
                                    <td className="border p-1">{!!el_rank ? el_rank.abbr : 'гп'}</td>
                                    <td className="border p-1">{el.name}</td>
                                    <td className="border p-1">{getNameToGroup(el_group, group)}</td>
                                    <td className="border p-1"/>
                                </tr>
                            })}
                        </table>
                    </>}

                    <p className="text-left font-bold ml-2 mt-4">Отсутствующие</p>
                    <table className="mt-1 text-center text-xs break-words w-full">
                        <tr className="font-bold">
                            <td className="border p-1">№ п/п</td>
                            <td className="border p-1">Воинское зван.</td>
                            <td className="border p-1">Фамилия, имя, отчество</td>
                            <td className="border p-1">Подразделение</td>
                            <td className="border p-1">Причина отсутствия</td>
                            <td className="border p-1">Время отсутств.</td>
                        </tr>

                        {notWorks.map((el, index) => {
                            let el_rank = rank.find(obj => obj.id === el.rank_id);
                            let el_group = group.find(obj => obj.id === el.group_id);
                            let el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
                            let el_status = status.find(obj => obj.id === (el_report ? el_report.status_id : null));
                            let el_status_parent = status.find(obj => obj.id === (el_status ? el_status.parent_id : null));

                            let el_comment = (el_status ? el_status.with_comment : false) ? el_report.comment : false;

                            return <tr className="text-left">
                                <td className="border p-1">{index + 1}</td>
                                <td className="border p-1">{el_rank ? el_rank.abbr : 'гп'}</td>
                                <td className="border p-1">{el.name}</td>
                                <td className="border p-1">{getNameToGroup(el_group, group)}</td>
                                <td className="border p-1">
                                    {
                                        el_status_parent
                                            ? el_status_parent.name
                                            : el_status ? el_status.name : ''
                                    }
                                    {
                                        el_comment
                                            ? ' (' + el_comment + ')'
                                            : ''
                                    }
                                </td>
                                <td className="border p-1"/>
                            </tr>
                        })}

                    </table>
                    <input className="mt-2 w-full" placeholder="Должность" value={!!boss ? boss['post_id__name'] : ''}
                           onChange={e => setBoss({...boss, 'post_id__name': e.target.value})}/>
                    <div>
                        <input placeholder="Звание" value={!!boss ? boss['rank_id__name'] : ''}
                               className="w-1/6 lowercase"
                               onChange={e => setBoss({...boss, 'rank_id__name': e.target.value})}/>
                        <input placeholder="И.Фамилия" value={!!boss ? boss['name'] : ''}
                               className="float-right text-right w-1/6"
                               onChange={e => setBoss({...boss, 'name': e.target.value})}/>
                    </div>
                </div>
            </div>
        </>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
        person: state.person,
        status: state.status,
        post: state.post,
        rank: state.rank,
        group: state.group
    }
}

export default connect(mapStateToProps)(ListOfRecords);