//core
import {useState, useEffect} from 'react';

//functions
import workWithServer from "../../../core/workWithServer";
import {getElemFromObj, getSubList} from "../../../core/localWorkWithList";

//hooks
import {useDate} from "../../../core/hooks/useDate";


function prepare_report(reports, status) {
    return reports.map( report => {
        report.status = status.find(status => status.id === report.status_id);
        return report
    })
}
export function useInitPage(user, person, group, status) {
    const date = useDate();

    const user_group_id= !!user.user_group ? user.user_group.id : null;

    const [searchByName, setSearchByName] = useState('');
    const [searchByGroup, setSearchByGroup] = useState(user_group_id);
    const [searchByGroupFull, setSearchByGroupFull] = useState(getElemFromObj(getSubList(user_group_id, group)));
    const [colorTrigger, setColorTrigger] = useState('');
    const [listOfReport, setListOfReport] = useState([]);

    const filterListOfPeople = person
        .filter(el => el.is_military)
        .filter(el => searchByGroupFull
            ? (
                searchByGroupFull.indexOf(el.real_group_id) !== -1
                || (searchByGroup === (user_group_id) && searchByGroupFull.indexOf(el.group_id) !== -1)
            )
            : true
        )
        .filter(el => el.name.toLowerCase().indexOf(searchByName.toLowerCase()) > -1
            || el.name.toLowerCase().indexOf(searchByName.altWordMaker()) > -1
        );

     useEffect(() => {
        workWithServer.getListOfReport({'date_begin': date.startDate, 'date_end': date.endDate})
            .then(data => {
                setListOfReport(prepare_report(data.report, status));
            });
    }, [date.startDate, date.endDate, status]);

    return {
        date,
        filterListOfPeople,
        search: {
            searchByName, setSearchByName,
            searchByGroup, setSearchByGroup,
            searchByGroupFull, setSearchByGroupFull
        },
        colorTrigger: {
            colorTrigger, setColorTrigger
        },
        listOfReport
    }
}
