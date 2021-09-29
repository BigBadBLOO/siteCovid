//core
import React from "react";
import {connect} from "react-redux";
import propTypes from 'prop-types';

//components
import Home from "./pages/home";
import Login from "./components/Login/Login";

//redux
import {
    initDuty, initGroup, initHolidays, initPerson, initPost, initRank, initStatus, initUser
} from "./redux/actions/actions";

//hooks
import {useInitUser} from "./core/hooks/useInitUser";


function App({user, initUser, initGroup, initRank, initHolidays, initStatus, initPost, initPerson}) {
    useInitUser(user, initUser, initGroup, initRank, initHolidays, initStatus, initPost, initPerson);
    return (
        user.is_initial
            ? (
                user.username
                    ? <Home/>
                    : <Login/>
            )
            : <span>Loading...</span>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        initUser: user => dispatch(initUser(user)),
        initGroup: group => dispatch(initGroup(group)),
        initRank: rank => dispatch(initRank(rank)),
        initHolidays: holiday => dispatch(initHolidays(holiday)),
        initStatus: status => dispatch(initStatus(status)),
        initPost: post => dispatch(initPost(post)),
        initPerson: person => dispatch(initPerson(person)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
    user: propTypes.object,
    initUser: propTypes.func,
    initRank: propTypes.func,
    initGroup: propTypes.func,
    initHolidays: propTypes.func,
    initStatus: propTypes.func,
    initPerson: propTypes.func,
    initPost: propTypes.func,
    initDuty: propTypes.func,
};
