//core
import React, {useState, createRef} from 'react'
import {connect} from "react-redux";

//components
import Button from "../../components/Button";
import {MyDatePicker} from "../../components/MyDatePicker";
import BlankDuty from "./BlankDuty";
import DutyCalculation from "./DutyCalculation";

//hooks
import {useCalcDuty} from "./hooks/useCalcDuty";

//functions
import workWithServer from '../../core/workWithServer'
import {get_human_month_im} from "../../core/localWorkWithDate";
import useDutyCalculation from "./hooks/useDutyCalculation";

/*
 Настройка системы распределения  нарядов
 1. В БД необходимым подразделениям выставить флаг forDuty в true
 2. В БД в званиях необходимо заполнить поля useDuty, и выбрать один из типов звания: "старший офицер" 'младший офицер' 'прапорщик'
 3. В БД необходимо укказать должностя у все пользователей
 */
function ListOfDuty({user, group, rank, post, holiday, headerRef}) {

    const {duty, date} = useCalcDuty(user, group, rank, post, holiday);
    const [nameByDay, countDutyInHolidays] = useDutyCalculation(duty, date, user);
    const user_is_editor = user.profile.find(el => el.page === 'listOfDuty' && el.action === 'edit');
    const user_is_control = user.profile.find(el => el.page === 'listOfDuty' && el.action === 'control');
    const [typeComponent, setTypeComponent] = useState((user_is_editor || user_is_control) ? 'blank' : 'calculation');  // blank or calculation

    const printRef = createRef();

    // Количество человек, записанных в наряды
    const countDutyByDay = duty.nameByDay
        ? Object.keys(duty.nameByDay).reduce((acc, value) => {
            let acc_value = 0;
            Object.keys(duty.nameByDay[value]).forEach(day => {
                if (parseInt(day) === -1 || parseInt(day) === 0 || !duty.nameByDay[value][day]['name']) {

                } else {
                    acc_value += 1
                }
            });
            acc += acc_value;
            return acc
        }, 0)
        : 0;

    return (
        <>
            <div ref={printRef}>
                <MyDatePicker
                    curr={date.curr}
                    currDate={date.currDate}
                    setCurrDate={date.setCurrDate}
                    setStartDate={date.setStartDate}
                    setEndDate={date.setEndDate}
                />
                {
                    (user_is_editor || user_is_control) && <>
                        <Button
                            type='primary'
                            text="Сохранить"
                            onClick={() => {
                                const personArray = {
                                    old_office_arr: duty.old_office_arr,
                                    old_office_count: duty.old_office_count,
                                    small_office_arr: duty.small_office_arr,
                                    small_office_count: duty.small_office_count,
                                    woman_arr: duty.woman_arr,
                                    woman_count: duty.woman_count,
                                    prapor_arr: duty.prapor_arr,
                                    prapor_count: duty.prapor_count,
                                    control_arr: duty.control_arr,
                                    control_count: duty.control_count,
                                };
                                workWithServer.setDutyInfo({
                                    data: {
                                        policeman: duty.policemanOfDuty,
                                        zsspdOfDuty: duty.zsspdOfDuty,
                                        corOfDuty: duty.corOfDuty,
                                        warehouseOfDuty: duty.warehouseOfDuty,
                                        buildingOfDuty: duty.buildingOfDuty,
                                        patrol2: duty.patrolOfDuty2,
                                        date: date.currDate,
                                        policeman_skip: duty.skipArrPolice,
                                        patrol2_skip: duty.skipArrPatrol,
                                        nameByDay: nameByDay,
                                        personArray: personArray,
                                        countDutyInHolidays: countDutyInHolidays ? countDutyInHolidays : duty.countDutyInHolidays
                                    }
                                })
                            }}
                        />
                        <Button
                            type='primary'
                            text={typeComponent === 'blank' ? 'Ведомость' : 'Расчет'}
                            onClick={() => setTypeComponent(typeComponent === 'blank' ? 'calculation' : 'blank')}
                        />
                    </>
                }


                <Button
                    type='primary'
                    text="Распечатать"
                    onClick={() => {
                        printRef.current.classList.add('hidden');
                        headerRef.current.classList.add('hidden');
                        window.print();
                        printRef.current.classList.remove('hidden');
                        headerRef.current.classList.remove('hidden');
                    }}
                />

                {
                    typeComponent === 'calculation' && user_is_control && <>
                        <Button
                            type='primary'
                            text="Скачать"
                            onClick={() => workWithServer.downloadDutyExcel({
                                data: {
                                    date: date.currDate,
                                }
                            }).then(r => {
                                const a = document.createElement('a');
                                a.href = r.xls;
                                a.download = "";
                                a.type = 'hidden';
                                document.body.appendChild(a);
                                a.click();
                                a.remove();
                            })
                            }
                        />
                        <Button
                            type='primary'
                            text="Утвердить"
                            disabled={(duty.count_days * 6 + duty.policemanOfDuty) !== countDutyByDay}
                            onClick={() => {
                                workWithServer.setPersonStatusByDuty({
                                    data: {
                                        date: date.currDate,
                                        nameByDay: duty.nameByDay
                                    }

                                })
                            }}
                        />
                        <Button
                            type='primary'
                            text="Пересчитать"
                            onClick={() => {
                                let success_try = true;

                                if (countDutyByDay !== 0) {
                                    success_try = window.confirm("Пересчет сбросит данные указанные подразделениями")
                                }

                                if (success_try) {
                                    duty.setNameByDay({})
                                }
                            }
                            }
                        />
                    </>
                }
            </div>

            <p className="font-bold m-2 text-center text-2xl">
                Ведомость и расчет
                на {get_human_month_im(date.startDate.getMonth())} {date.startDate.getFullYear()} года
            </p>

            {
                typeComponent === 'blank'
                    ? <BlankDuty duty={duty}/>
                    : <DutyCalculation duty={duty} date={date} nameByDay={nameByDay} countDutyByDay={countDutyByDay}/>
            }
        </>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
        group: state.group,
        rank: state.rank,
        post: state.post,
        holiday: state.holiday
    }
}

export default connect(mapStateToProps)(ListOfDuty);
