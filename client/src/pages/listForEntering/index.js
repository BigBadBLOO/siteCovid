//core
import React, {createRef, useEffect, useState} from 'react'
import DatePicker from "react-datepicker";
import {connect} from "react-redux";

//components
import Button, {InputForDatePicker} from "../../components/Button";

//functions
import workWithServer from "../../core/workWithServer";
import {isDayNotNormal} from "../../core/localWorkWithDate";
import {getSubList, getElemFromObj, getLevelObj} from "../../core/localWorkWithList";
import {getNameToGroup} from "../../core/localWorkWithGroup";

function ListForEntering({ user, holiday, group, rank,  person, status, headerRef, myReload}) {
    const dateToday = new Date();
    dateToday.setDate(dateToday.getDate() + 1);

    const tomorrow = new Date(dateToday);
    const [startDate, setStartDate] = useState(tomorrow);

    const printRef = createRef();
    const user_permission = user.profile.find(el => el.action === 'get_all_user');
    const userGroupSub = user_permission ? getLevelObj(user.user_group_sub) : user.user_group_sub;
    const userGroupSubId = user_permission ? getElemFromObj(userGroupSub) : user.user_group_sub_id;

    const [listOfReport, setListOfReport] = useState([]);

    const getListForEntering = () => {
        workWithServer.getListOfReport({'date': startDate}).then(data => {
            setListOfReport(data.report)
        })
    };

    useEffect(() => {
        getListForEntering();
    }, [startDate, myReload]);

    const notOnWorkAll = person.filter(el => {
        const el_report = listOfReport.find(obj => obj.userForControl_id === el.id);
        const el_status = status.find(obj => obj.id === (!!el_report ? el_report.status_id : null));
        const el_group = group.find(obj => obj.id === el.group_id);

        let flag = true;

        if (!!user.user_group && user.user_group.out) {
            flag = userGroupSubId.indexOf(el.real_group_id) !== -1;
        } else {
            flag = !!el_group ? !el_group.out : false;
        }

        if (isDayNotNormal(startDate, holiday)) {
            return !!el_status && el_status.with_kpp_we && flag;
        }

        return !el_status || (!!el_status && !(el_status.with_kpp) && flag);
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

                <DatePicker
                    className="w-24 m-2 border-blue-700 rounded border "
                    selected={startDate}
                    showWeekNumbers
                    locale="ru"
                    onChange={date => setStartDate(date)}
                    dateFormat="dd.MM.yyyy"
                    customInput={<InputForDatePicker/>}
                />
            </div>
            <p className="font-bold m-2 text-center text-2xl">
                {(isDayNotNormal(startDate, holiday)) ?
                    <>Списки на проход на </>
                    :
                    <>Проход запрещен </>
                }
                {startDate.toLocaleDateString('ru')}
            </p>
            {userGroupSub.map(one_group => {
                let byGroup = [];
                if(user_permission) {
                    let el_ChildrenList = getElemFromObj(getSubList(one_group, group));
                    byGroup = notOnWorkAll.filter(person => el_ChildrenList.indexOf(person.real_group_id) !== -1);
                }
                else{
                    byGroup = notOnWorkAll.filter(person => person.real_group_id === one_group.id);
                }
                const chunk_size = Math.ceil(byGroup.length / 4);
                const groups = byGroup.map(function (e, i) {
                    return i % chunk_size === 0 ? byGroup.slice(i, i + chunk_size) : null;
                }).filter(e => e);
                const [mass1, mass2, mass3, mass4] = groups;

                return (
                    <>
                        {byGroup.length > 0
                            ?
                            <div>
                                <p className="text-center font-semibold text-2xl border p-1">{getNameToGroup(one_group, group)}</p>
                                <div className="text-center text-xs">
                                    <div className="flex">
                                        {groups.map(ar =>{
                                            return <React.Fragment key={ar.name}>
                                                <p  className="border p-1 inline-block w-1/12">№</p>
                                                <p className="border p-1 inline-block w-2/12">Звание и ФИО</p>
                                            </React.Fragment>
                                        })}
                                    </div>
                                    {mass1.map((el, index) => {
                                        const mass2elem = mass2 ? mass2[index] : null;
                                        const mass3elem = mass3 ? mass3[index] : null;
                                        const mass4elem = mass4 ? mass4[index] : null;
                                        let el_rank = rank.find(obj => obj.id === (!!el ? el.rank_id : null));
                                        let mass2elem_rank = rank.find(obj => obj.id === (!!mass2elem ? mass2elem.rank_id : null))
                                        let mass3elem_rank = rank.find(obj => obj.id === (!!mass3elem ? mass3elem.rank_id : null))
                                        let mass4elem_rank = rank.find(obj => obj.id === (!!mass4elem ? mass4elem.rank_id : null))
                                        return (
                                            <div className="flex">
                                                <p className="border p-1 inline-block w-1/12">{index + 1}</p>
                                                <p
                                                    className="border p-1 inline-block w-2/12 text-left">{!!el_rank ? el_rank.abbr : 'гп'} {el.name}</p>
                                                {
                                                    mass2elem && <>
                                                        <p className="border p-1 inline-block w-1/12">{chunk_size + index + 1}</p>
                                                        <p className="border p-1 inline-block w-2/12 text-left">
                                                            {!!mass2elem_rank ? mass2elem_rank.abbr : 'гп'} {mass2elem.name}
                                                        </p>
                                                    </>
                                                }
                                                {
                                                    mass3elem && <>
                                                        <p className="border p-1 inline-block w-1/12">{chunk_size * 2 + index + 1}</p>
                                                        <p className="border p-1 inline-block w-2/12 text-left">
                                                            {!!mass3elem_rank ? mass3elem_rank.abbr : 'гп'} {mass3elem.name}
                                                        </p>
                                                    </>
                                                }
                                                {
                                                    mass4elem && <>
                                                        <p className="border p-1 inline-block w-1/12">{chunk_size * 3 + index + 1}</p>
                                                        <p className="border p-1 inline-block w-2/12 text-left">
                                                            {!!mass4elem_rank ? mass4elem_rank.abbr : 'гп'} {mass4elem.name}
                                                        </p>
                                                    </>
                                                }
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            : <></>
                        }
                        <br/>
                    </>
                )
            })}
        </>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
        holiday: state.holiday,
        rank: state.rank,
        group: state.group,
        person: state.person,
        status: state.status
    }
}

export default connect(mapStateToProps)(ListForEntering);