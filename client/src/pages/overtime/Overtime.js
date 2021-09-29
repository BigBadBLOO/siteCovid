//core
import React, {useEffect, useState} from 'react'
import {connect} from "react-redux";

//components
import PanelWithFunctional from "./components/PanelWithFunctional";
import Table from "./components/Table";

//hooks
import useCalcOvertime, {calcOvertime} from "./hooks/useCalcOvertime";
import {useInitPage} from "./hooks/useInitPage";

//styles
import "./index.css"


function Overtime({user, rank, status, person, group, holiday}) {
    const {
        date,
        filterListOfPeople,
        search,
        colorTrigger,
        listOfReport
    } = useInitPage(user, person, group, status, holiday);

    const {listOvertime, setListOvertime, prevListOvertime} = useCalcOvertime(filterListOfPeople, date, listOfReport , holiday, status);

    const recalcListOvertime = () => {
        setListOvertime(calcOvertime(filterListOfPeople, listOfReport, holiday, prevListOvertime, status))
    };
    return (
        <div>
            <PanelWithFunctional
                user={user}
                group={group}
                date={date}
                search={search}
                listOvertime={listOvertime}
                colorTrigger={colorTrigger}
                setListOvertime={recalcListOvertime}
            />
            <Table
                user={user}
                filterListOfPeople={filterListOfPeople}
                rank={rank}
                group={group}
                listOvertime={listOvertime}
                setListOvertime={setListOvertime}
                colorTrigger={colorTrigger}
            />
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
        rank: state.rank,
        holiday: state.holiday,
        status: state.status,
        person: state.person,
        group: state.group,
    }
}

export default connect(mapStateToProps)(Overtime);