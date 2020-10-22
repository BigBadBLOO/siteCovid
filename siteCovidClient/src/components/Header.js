import React from "react";
import Button from "./Button";
import workWithServer from "../core/workWithServer";
import {initUser} from "../redux/actions/actions";
import {connect} from "react-redux";

function Header({user, initUser, headerRef}) {

  const logOut = () => {
    workWithServer.logOut().then(() => initUser({...user, username: ''}))
  };

  return (
    <>
      <div ref={headerRef} className="p-3 border-b flex justify-between">
        <span className="my-auto p-2 border rounded border-blue-600">{user.username} - {user.group}</span>
        <Button className="" type='primary' onClick={logOut} text="Выйти"/>
      </div>
    </>
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

export default connect(mapStateToProps,mapDispatchToProps )(Header)