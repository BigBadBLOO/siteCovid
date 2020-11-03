import React, {useState} from "react";
import Button from "./Button";
import workWithServer from "../core/workWithServer";
import {initUser} from "../redux/actions/actions";
import {connect} from "react-redux";
import doc from '../documentation.docx'

function Header({user, initUser, headerRef}) {
  const [changePassword, setChangePassword] = useState(false);
  const [password, SetPassword] = useState('');
  const logOut = () => {
    workWithServer.logOut().then(() => initUser({...user, username: ''}))
  };

  return (
    <>
      <div ref={headerRef} className="p-3 border-b flex justify-between">
        <div>
          <span className="my-auto p-2 border rounded border-blue-600">{user.username} - {user.group}</span>
          {/*<a href={doc} className="my-auto p-2 no-underline hover:underline text-blue-500">Документация</a>*/}
        </div>
        <div>
          {!user.is_control && (!changePassword
            ? <Button className="" type='warning' onClick={() => {
              setChangePassword(true)
            }} text="Сменить пароль"/>
            : (
              <>
                <input type="text" className="rounded border border-blue-700 p-1" value={password} onChange={e => {
                  SetPassword(e.target.value)
                }}
                       placeholder="Введите новый пароль..."/>
                <Button type='warning' onClick={() => {
                  setChangePassword(false);
                  workWithServer.changePassword({'password': password}).then(() => {
                    initUser({...user, username: ''})
                  });
                }} text="Сохранить пароль"/>
              </>
            ))
          }
          <Button className="" type='primary' onClick={logOut} text="Выйти"/>
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Header)