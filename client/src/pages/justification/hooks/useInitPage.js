//core
import {useState, useEffect} from 'react';

//functions
import workWithServer from "../../../core/workWithServer";
import {getElemFromObj, getSubList} from "../../../core/localWorkWithList";

//hooks


export function useInitPage(user, person, group) {
    const [dateInterval, setDateInterval] = useState('current_day');

    const curr = new Date();
    const [date, setDate] = useState({
        currDate: curr,
        startDate: curr,
        endDate: curr,
        arrWithDate: []
    });

    const [arrWithReport, setArrWithReport] = useState([]);

    useEffect(() => {
        if (dateInterval === 'current_day') {
            setDate(prev => ({
                ...prev,
                startDate: prev.currDate,
                endDate: prev.currDate,
                arrWithDate: [prev.currDate]
            }));
        } else if (dateInterval === 'current_week') {
            let date_begin = new Date(date.currDate.getFullYear(), date.currDate.getMonth(), date.currDate.getDate() - date.currDate.getDay() + 1, 5);
            let date_end = date.currDate;
            let currentDate = new Date(date_begin);
            const arr_with_date = [];
            while (currentDate <= date_end) {
                arr_with_date.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1)
            }
            setDate(prev => ({
                ...prev,
                startDate: date_begin,
                endDate: date_end,
                arrWithDate: arr_with_date
            }));
        } else if (dateInterval === 'current_month') {
            let date_begin = new Date(date.currDate.getFullYear(), date.currDate.getMonth(), 1, 5);
            let date_end = date.currDate;
            let currentDate = new Date(date_begin);
            const arr_with_date = [];
            while (currentDate <= date_end) {
                arr_with_date.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1)
            }
            setDate(prev => ({
                ...prev,
                startDate: date_begin,
                endDate: date_end,
                arrWithDate: arr_with_date
            }));
        }
    }, [dateInterval]);


    const [searchByName, setSearchByName] = useState('');
    const [searchByGroup, setSearchByGroup] = useState(user.user_group.id);
    const [searchByGroupFull, setSearchByGroupFull] = useState(getElemFromObj(getSubList(user.user_group.id, group)));


    const filterListOfPeople = person
        .filter(el => el.is_military)
        .filter(el => !!searchByGroupFull
            ? (
                searchByGroupFull.indexOf(el.real_group_id) !== -1
                || (searchByGroup === user.user_group.id && searchByGroupFull.indexOf(el.group_id) !== -1)
            )
            : true
        )
        .filter(el => el.name.toLowerCase().indexOf(searchByName.toLowerCase()) > -1
            || el.name.toLowerCase().indexOf(searchByName.altWordMaker()) > -1
        );

    useEffect(() => {
        workWithServer.getListOfReport({'date_begin': date.startDate, 'date_end': date.endDate ? date.endDate : date.startDate})
            .then(data => {
                setArrWithReport(data.report);
            });
    }, [date]);

    return {
        date: {
            dateInterval, setDateInterval,
            ...date, setDate
        },
        filterListOfPeople,
        search: {
            searchByName, setSearchByName,
            searchByGroup, setSearchByGroup,
            searchByGroupFull, setSearchByGroupFull
        },
        arrWithReport
    }
}
