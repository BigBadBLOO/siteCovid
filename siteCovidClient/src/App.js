import React, {useEffect} from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import workWithServer from "./core/workWithServer";
import Login from "./components/Login";
import Home from "./components/Home";
import {initUser} from "./redux/actions/actions";

function App({user, initUser}) {
	useEffect(() => {
			workWithServer.initUser()
				.then(data => {
					initUser({...data, is_initial: true})
				})
				.catch(() => {
					initUser({...user, is_initial: true})
				})
		}, []
	)

	return (
		user.is_initial
			? (
				user.username
					? <Home/>
					: <Login/>
			)
			: <span>Loading</span>
	)
}

function mapStateToProps(state) {
	return {
		user: state.user,
	}
}

function mapDispatchToProps(dispatch) {
	return {
		initUser: user => dispatch(initUser(user))
	}
}
export default connect(mapStateToProps,mapDispatchToProps)(App);

App.propTypes = {
	user: PropTypes.object,
	initUser: PropTypes.func,
};
