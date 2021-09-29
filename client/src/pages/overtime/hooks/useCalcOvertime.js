//core
import {useState, useEffect, useMemo} from 'react'

//function
import workWithServer from "../../../core/workWithServer";
import {isDayNotNormal} from "../../../core/localWorkWithDate";

export function calcOvertime(persons, listOfReport, holiday, overtime_prev, status) {
    return persons.map(el => {
            const reports = listOfReport.filter(report => report.userForControl_id === el.id);
            const report_free = reports.filter(report => report.status && report.status.name === 'Отгул');
            const report_duty = reports.filter(report => {
                const parent_status = report.status && status && status.find(el => el.id === report.status.parent_id);

                return (parent_status && parent_status.name === 'Наряд') || (report.status && report.status.name === 'Дежурство') || (report.status && report.status.name === 'Наряд');
                // return parent_status && parent_status.name === 'Наряд';
            });

            console.log(el);
            console.log(report_duty);

            const {workday_count, weekends_count, weekends_hours, workday_hours} = report_duty.reduce((acc, value, index, array) => {
                let prev_date = null;
                let current_date = new Date(value.date + " 5:00");
                if (index > 0) prev_date = new Date(array[index - 1].date + " 5:00");
                if (current_date - prev_date <= 86400000) return acc;
                let next_date = new Date(current_date);
                next_date.setDate(next_date.getDate() + 1);


                if (!!value.status) {
                    let status_type = (['Дежурный по части', 'Помошник дежурного по части'].indexOf(value.status.name) >= 0) * 1;

                    let count_hours = 0;

                    if (!status_type) {
                        if (['Дежурство'].indexOf(value.status.name) >= 0) {
                            status_type = 2;
                        }
                    }


                    if (value.status && isDayNotNormal(current_date, holiday) || isDayNotNormal(next_date, holiday)) {

                        if (!isDayNotNormal(current_date, holiday) && isDayNotNormal(next_date, holiday)) {
                            switch (status_type) {
                                case 0:
                                    count_hours = 14;
                                    break;
                                case 1:
                                    count_hours = 15;
                                    break;
                                case 2:
                                    count_hours = 1;
                                    break;
                            }
                        }

                        if (isDayNotNormal(current_date, holiday) && isDayNotNormal(next_date, holiday)) {
                            switch (status_type) {
                                case 0:
                                    count_hours = 21;
                                    break;
                                case 1:
                                    count_hours = 22;
                                    break;
                                case 2:
                                    count_hours = 9;
                                    break;
                            }
                        }

                        if (isDayNotNormal(current_date, holiday) && !isDayNotNormal(next_date, holiday)) {
                            switch (status_type) {
                                case 0:
                                    count_hours = 13;
                                    break;
                                case 1:
                                    count_hours = 14;
                                    break;
                                case 2:
                                    count_hours = 9;
                                    break;
                            }
                        }
                        acc.weekends_count += 1;
                        acc.weekends_hours += count_hours;
                    } else {
                        switch (status_type) {
                            case 0:
                                count_hours = 6;
                                break;
                            case 1:
                                count_hours = 7;
                                break;
                            case 2:
                                count_hours = 1;
                                break;
                        }
                        acc.workday_count += 1;
                        acc.workday_hours += count_hours;
                    }


                }
                return acc

            }, {workday_count: 0, weekends_count: 0, weekends_hours: 0, workday_hours: 0});

            const prev_overtime = overtime_prev.find(overtime => overtime.user_id === el.id);
            return {
                user_id: el.id,
                duty_workday_count: workday_count,
                duty_workday_hours: workday_hours,
                duty_weekends_count: weekends_count,
                duty_weekends_hours: weekends_hours,
                without_restrictions_count: 0,
                without_restrictions_total: 0,
                dcoo_count: 0,
                dcoo_total: 0,
                other_hours: 0,
                other_total: 0,
                realize_duty_workday: report_free.length,
                realize_duty_holiday: 0,
                realize_duty_by_money: 0,
                total_overtime_last_month: prev_overtime ? Number(prev_overtime.total_overtime) : 0,
                total_overtime: 0,
            }
        }
    )
}

const useCalcOvertime = (persons, date, listOfReport, holiday, status) => {

    const [listOvertime, setListOvertime] = useState([]);
    const [prevListOvertime, setPrevListOvertime] = useState([]);

    useEffect(() => {
        if (listOvertime && listOvertime.length === 0) {
            setListOvertime(calcOvertime(persons, listOfReport, holiday, prevListOvertime, status))
        }
    }, [persons, prevListOvertime, holiday, listOfReport, status]);

    useEffect(() => {
        (async function fetchData() {
            let overtime_prev = await workWithServer.getOvertime({'date': new Date(date.startDate.getFullYear(), date.startDate.getMonth() - 1, date.startDate.getDate(), 5, 0)});
            overtime_prev = 'overtime' in overtime_prev ? overtime_prev.overtime : [];
            let overtime = await workWithServer.getOvertime({'date': date.startDate});
            overtime = 'overtime' in overtime ? overtime.overtime : [];
            setPrevListOvertime(overtime_prev);
            const temp_data = overtime.length > 0
                ? overtime
                : calcOvertime(persons, listOfReport, holiday, overtime_prev, status);
            setListOvertime(temp_data)
        })();
    }, [date.startDate, listOfReport, holiday, status]);
    return {listOvertime, setListOvertime, prevListOvertime}
};

export default useCalcOvertime
