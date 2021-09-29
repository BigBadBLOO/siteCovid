//core
import {useState, useEffect, useMemo} from 'react';

//functions
import workWithServer from "../../../core/workWithServer";
import {getElemFromObj, getLast, getSubList, getVaccineStatus} from "../../../core/localWorkWithList";
import {compareDate, isWorkDayShow} from "../../../core/localWorkWithDate";

//hooks
import {useDate} from "../../../core/hooks/useDate";


export function useInitPage(user, holiday, status, person, group, myReload) {
    const date = useDate();
    const [arrWithDate, setArrWithDate] = useState([]);
    const [searchByName, setSearchByName] = useState('');
    const [searchByVaccine, setSearchByVaccine] = useState('');
    const [searchByGroup, setSearchByGroup] = useState(!!user.user_group ? user.user_group.id : null);
    const [searchByGroupFull, setSearchByGroupFull] = useState(getElemFromObj(getSubList(!!user.user_group ? user.user_group.id : null, group)));
    const user_is_editor = user.profile.find(el => el.action === 'edit' && el.page === 'mainPageForCenter');


    const [listOfReport, setListOfReport] = useState([]);

    const [show, setShow] = useState(false);
    const [endDateForModal, setEndDateForModal] = useState(null);
    const [personModal, setPersonModal] = useState({});
    const [objectModal, setObjectModal] = useState({});
    const [showError, setShowError] = useState([]);

    const [listOfVaccine, setListOfVaccine] = useState([]);
    const [showVaccine, setShowVaccine] = useState(false);
    const [objectVaccineModal, setObjectVaccineModal] = useState({'vaccineList': []});
    const [vaccineModal, setVaccineModal] = useState({});
    const [vaccineError, setVaccineError] = useState([]);

    const [listOfCoronaDayData, setListOfCoronaDayData] = useState([]);
    const [listOfAntitela, setListOfAntitela] = useState([]);
    const [showAntitela, setShowAntitela] = useState(false);
    const [objectAntitelaModal, setObjectAntitelaModal] = useState({});
    const [antitelaModal, setAntitelaModal] = useState({});
    const [antitelaError, setAntitelaError] = useState([]);

    const [extraStatus, setExtraStatus] = useState([]);
    const [extraFields, setExtraFields] = useState({});
    const [showExtraFields, setShowExtraFields] = useState(false);

    const workWithExtraFields = status => setShowExtraFields(status ? status.with_extraField : false);

    const workWithStatus = (el, extrafields) => {
        setShowError([]);

        const one_status = status.find(elem => elem.id === el.status_id);
        const children_status = one_status ? status.filter(elem => elem.parent_id === one_status.id) : [];
        workWithExtraFields(children_status.length > 0 ? children_status[0] : one_status);
        setExtraStatus(children_status);

        if (one_status && one_status.parent_id) {
            el.extra_status_id = el.status_id;
            el.status_id = one_status.parent_id;
            setExtraStatus(status.filter(el => el.parent_id === one_status.parent_id));
            one_status.with_extraField && Object.keys(extrafields).length === 0 && setExtraFields({'t': ''})
            // } else if (children_status.length > 0) {
            //     el.extra_status_id = children_status[0].id;
            //     el.status_id = one_status.id;
            //     children_status[0].with_extraField && Object.keys(extrafields).length === 0 && setExtraFields({'t': ''})
        } else {
            el.extra_status_id = null;
            setExtraFields({})
        }
        return el
    };

    const vaccine_modal = (worker, obj) => {
        setVaccineModal(worker);
        let el = {'userForControl_id': worker.id, 'vaccineList': obj ? obj : []};
        el['editModal'] = user_is_editor ? (user.user_group_sub_id.indexOf(worker.real_group_id) !== -1) : false;
        el['openModal'] = true;
        setObjectVaccineModal(el);
        setVaccineError([]);
        setShowVaccine(true);
    };

    const antitela_modal = (worker, obj) => {
        setAntitelaModal(worker);
        let el = obj ? {...obj} : {'userForControl_id': worker.id};
        el['editModal'] = user_is_editor ? (user.user_group_sub_id.indexOf(worker.real_group_id) !== -1) : false;
        setObjectAntitelaModal(el);
        setAntitelaError([]);
        setShowAntitela(true);
    };

    const modal = (worker, obj, dateModal) => {
        setPersonModal(worker);
        setExtraFields({});

        let el = obj ? {...obj} : {'userForControl_id': worker.id};
        el['workDay'] = isWorkDayShow(date.curr, dateModal, holiday);
        el['date'] = dateModal;
        el['editModal'] = user_is_editor
            ? (compareDate(date.curr, dateModal) < 1 && user.user_group_sub_id.indexOf(worker.real_group_id) !== -1)
            : false;

        if (!!el.id) {
            workWithServer.getExtraFieldsForStatus({'day_data_id': el.id}).then((data) => {
                setExtraFields(data);
            });
        }

        el = workWithStatus(el, extraFields);
        setObjectModal(el);
        setShowError([]);
        setShow(true);
    };

    useEffect(() => {
        workWithServer.getListOfReport({'date_begin': date.startDate, 'date_end': date.endDate})
            .then(data => {
                setListOfReport(data.report);
                setListOfVaccine(data.vaccine);
                setListOfAntitela(data.antitela);
                setListOfCoronaDayData(data.corona_daydata);
            });
        const tempArrWithDate = [];
        const currentDate = new Date(date.startDate);
        while (date.endDate >= currentDate) {
            tempArrWithDate.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1)
        }
        setArrWithDate(tempArrWithDate)
    }, [date.startDate, date.endDate, myReload]);

    const filterListOfPeople = useMemo(() => {
        return person
            .filter(el => !!searchByGroupFull
                ? (
                    searchByGroupFull.indexOf(el.real_group_id) !== -1
                    || (searchByGroup === (!!user.user_group ? user.user_group.id : null) && searchByGroupFull.indexOf(el.group_id) !== -1)
                )
                : true
            )
            .filter(el => el.name.toLowerCase().indexOf(searchByName.toLowerCase()) > -1
                || el.name.toLowerCase().indexOf(searchByName.altWordMaker()) > -1
            )
            .filter(el => {
                const vaccineObj = listOfVaccine.filter(vac => vac.userForControl_id === el.id);

                const lastVaccineObj = getLast(vaccineObj);
                const vaccineObj_success = getVaccineStatus(lastVaccineObj);
                switch (searchByVaccine) {
                    case '':
                        return true;
                    case 'active':
                        return vaccineObj_success;
                    case 'missing':
                        return vaccineObj_success === null;
                    case 'need':
                        return !vaccineObj_success;
                    default:
                        return true
                }
            });
    }, [person, searchByGroupFull, searchByGroup, searchByName, searchByVaccine, listOfVaccine]);

    return {
        date,
        filterListOfPeople,
        arrWithDate,
        search: {
            searchByName, setSearchByName,
            searchByGroup, setSearchByGroup,
            searchByGroupFull, setSearchByGroupFull,
            searchByVaccine, setSearchByVaccine
        },
        vaccine: {
            showVaccine, setShowVaccine,
            objectVaccineModal, setObjectVaccineModal,
            vaccineModal, setVaccineModal,
            listOfVaccine, setListOfVaccine,
            vaccineError, setVaccineError,
            vaccine_modal
        },
        antitela: {
            showAntitela, setShowAntitela,
            objectAntitelaModal, setObjectAntitelaModal,
            antitelaModal, setAntitelaModal,
            listOfAntitela, setListOfAntitela,
            antitelaError, setAntitelaError,
            antitela_modal, listOfCoronaDayData
        },
        report: {
            listOfReport, setListOfReport
        },
        modal: {
            modal,
            show, setShow,
            endDateForModal, setEndDateForModal,
            objectModal, setObjectModal,
            showError, setShowError,
            personModal, setPersonModal,
            workWithStatus,
            extraStatus, setExtraStatus,
            extraFields, setExtraFields,
            showExtraFields, setShowExtraFields
        }
    }
}
