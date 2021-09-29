//core
import React from 'react'
import {Route, Switch} from "react-router-dom";

//pages
import MainPageForCenter from '../../pages/mainPageForCenter/MainPageForCenter'
import ListOfDuty from '../../pages/duty'
import ListForEntering from '../../pages/listForEntering'
import SeeReport from '../../pages/seeReport'
import ListOfPerson from "../../pages/listOfPerson";
import ListOfRecords from "../../pages/listOfRecord";
import Overtime from "../../pages/overtime/Overtime";
import Delegation from '../../pages/delegation'
import PageNotFound from '../../pages/pageNotFound'
import {connect} from "react-redux";


const dictWithComponent = (key, params) => {
    const dictinary = {
        'overtime': () => <Overtime {...params}/>,
        // 'listOfPost': () => <ListOfPost {...params}/>,
        'listForEntering': () => <ListForEntering {...params}/>,
        'seeReport': () => <SeeReport {...params}/>,
        'listOfRecords': () => <ListOfRecords {...params}/>,
        'listOfPerson': () => <ListOfPerson {...params}/>,
        'listOfDuty': () => <ListOfDuty {...params}/>,
        'delegation': () => <Delegation {...params}/>,

    };
    return dictinary[key]
}

function Routing({user, myReload, headerRef, setShowAlert}) {
    return (
        <div className="px-2">
            <Switch>
                <Route path="/" exact={true}>
                    <MainPageForCenter/>
                </Route>
                {
                    user.pages.map(page => {

                        return <Route key={page} path={`/${page}`} exact={true}>
                            {
                                dictWithComponent(page, {
                                    myReload,
                                    headerRef,
                                    setShowAlert
                                })
                            }
                        </Route>

                    })
                }
                <Route>
                    <PageNotFound/>
                </Route>
            </Switch>
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps, null)(Routing)