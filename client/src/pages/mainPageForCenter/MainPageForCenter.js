//core
import React, {useEffect, useState} from 'react'
import {connect} from "react-redux";

//components
import PanelWithFunctional from "./components/PanelWithFunctional";
import Table from "./components/Table";
import Info from "./components/Info";
import ModalVaccine from "./components/ModalVaccine";
import ModalCell from "./components/ModalCell";

//hooks
import {useInitPage} from "./hooks/useInitPage.js";

//styles
import "./index.css"
import ModalAntitela from "./components/ModalAntitela";
import TableVaccine from "./components/TableVaccine";


function MainPageForCenter({user, rank, holiday, status, person, group, myReload}) {
    const {
        date,
        filterListOfPeople,
        arrWithDate,
        search,
        report,
        vaccine,
        modal,
        antitela
    } = useInitPage(user, holiday, status, person, group, myReload);

    const [tableContent, setTableContent] = useState('main'); //main or vaccine

    return (
        <div>
            {!!user.user_group
                ? <>
                    < PanelWithFunctional
                        user={user}
                        group={group}
                        date={date}
                        search={search}
                        tableContent={tableContent}
                        setTableContent={setTableContent}
                    />
                    {
                        tableContent === 'vaccine'
                            ? <TableVaccine
                                user={user}
                                status={status}
                                date={date}
                                filterListOfPeople={filterListOfPeople}
                                arrWithDate={arrWithDate}
                                report={report}
                                rank={rank}
                                vaccine={vaccine}
                                antitela={antitela}
                                holiday={holiday}
                                modal={modal}
                            />
                            : <Table
                                user={user}
                                status={status}
                                date={date}
                                filterListOfPeople={filterListOfPeople}
                                arrWithDate={arrWithDate}
                                report={report}
                                rank={rank}
                                vaccine={vaccine}
                                antitela={antitela}
                                holiday={holiday}
                                modal={modal}
                            />
                    }


                    <ModalVaccine
                        vaccine={vaccine}
                    />
                    <ModalAntitela
                        antitela={antitela}
                    />
                    <ModalCell
                        modal={modal}
                        status={status}
                        date={date}
                        report={report}
                    />

                </>
                : <Info
                    user={user}
                />
            }
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
        duty: state.duty
    }
}

export default connect(mapStateToProps)(MainPageForCenter);