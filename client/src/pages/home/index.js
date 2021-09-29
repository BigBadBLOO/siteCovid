//core
import React, {createRef, useEffect, useState} from "react";
import propTypes from 'prop-types';
import {connect} from "react-redux";

//components
import Header from "../../components/Header";
import Routing from "../../components/Routing/Routing";
import Loader from "../../components/Loader";

//redux
import {destroyPerson, initPerson} from "../../redux/actions/actions";

//hooks
import {useReload} from "./hooks/useReload";

//functions
import "../../core/localWorkTranslit";

function Home() {
    const headerRef = createRef();

    const [showAlert, setShowAlert] = useState(null);
    const {myReload} = useReload();

    useEffect(() => {
        showAlert !== null && !!showAlert.time && setTimeout(() => setShowAlert(null), showAlert.time * 1000)
    }, [showAlert]);

    return (
        <>
        <Header headerRef={headerRef} showAlert={showAlert} setShowAlert={setShowAlert}/>
        <Routing myReload={myReload} headerRef={headerRef} setShowAlert={setShowAlert}/>
        <Loader/>
        </>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        initPerson: person => dispatch(initPerson(person)),
        destroyPerson: person => dispatch(destroyPerson(person)),
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)

Home.propTypes = {
    user: propTypes.object,
    initPerson: propTypes.func,
    destroyPerson: propTypes.func,
};