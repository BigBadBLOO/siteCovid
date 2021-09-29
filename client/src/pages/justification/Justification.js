//core
import React, {useEffect, useState} from 'react'
import {connect} from "react-redux";

//components
import PanelWithFunctional from "./components/PanelWithFunctional";
import Table from "./components/Table";

//hooks
import {useInitPage} from "./hooks/useInitPage";


function Justification({user, rank, status, person, group, holiday}) {
    const {
        date,
        filterListOfPeople,
        search,
        arrWithReport
    } = useInitPage(user, person, group);

    return (
        <div>
            <PanelWithFunctional
                user={user}
                group={group}
                date={date}
                search={search}
            />
            <Table
                user={user}
                filterListOfPeople={filterListOfPeople}
                rank={rank}
                date={date}
                group={group}
                arrWithReport={arrWithReport}
                status={status}
                holiday={holiday}
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
        group: state.group
    }
}

export default connect(mapStateToProps)(Justification);