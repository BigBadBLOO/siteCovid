import React, {useState} from "react"
import PropTypes from "prop-types";
import workWithServer from "../core/workWithServer";
import Button from "./Button";
import {initUser} from "../redux/actions/actions";
import {connect} from "react-redux";

function Login({initUser}) {
  const [name, setName] = useState('');
  const [validName, setValidName] = useState(true);
  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(true);

  const login = (e) => {
    e.preventDefault()
    const validName = name.length > 0
    const validPassword = password.length > 0
    setValidName(validName)
    setValidPassword(validPassword)

    if (setValidName && validPassword) {
      workWithServer.login({
        "username": name,
        "password": password
      }).then((data) => {
        data['error'] ? setValidName(false) :
        initUser({...data, is_initial: true})
      })
        .catch(() => {setValidName(false)})
    }

  }
  return (
    <div className="mt-40">
      <p className="text-3xl mx-auto text-center"> Пройдите авторизацию в системе</p>
      <form className="pt-4 w-1/2 mx-auto" onSubmit={login}>
        <div className="mb-2">
          <label className="block mb-1" htmlFor="name">
            Имя
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-600"
            id="email"
            type="text"
            placeholder="Введите имя"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setValidName(true)
            }}
          />
          {!validName && <label className="text-xs text-red-400 pl-2">Пользователя не существует</label>}
        </div>

        <div className="mb-2">
          <label className="block mb-1" htmlFor="password">
            Пароль
          </label>
          <input
            className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-600"
            id="password"
            type="password"
            placeholder="Введите пароль"
            onChange={(e) => {
              setPassword(e.target.value);
              setValidPassword(true)
            }}
          />
          {!validPassword && <label className="text-xs text-red-400 pl-2">Некорректный пароль</label>}
        </div>

        <div className="mb-2 text-center">
          <Button text="Войти в аккаунт" type="primary"/>
        </div>
      </form>
    </div>
  )
}

function mapDispatchToProps(dispatch) {
  return {
    initUser: user => dispatch(initUser(user))
  }
}

export default connect(null, mapDispatchToProps)(Login)
Login.propTypes = {
  loginUser: PropTypes.func,
};
