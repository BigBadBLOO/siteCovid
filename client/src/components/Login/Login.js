//core
import React from "react"
// import {connect} from "react-redux";

//components
import Button from "../Button";

//hooks
import {useLogin} from "./hooks/useLogin";

export default function Login() {
    const {name, password, loader, login} = useLogin();

    return (
        <div className="mt-40">
            <p className="text-3xl mx-auto text-center">Пройдите авторизацию в системе</p>
            <form className="pt-4 w-1/4 mx-auto" onSubmit={login}>
                <div className="mb-2">
                    <label className="block mb-1">
                        Имя
                    </label>
                    <input
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-600"
                        id="email"
                        type="text"
                        placeholder="Введите имя"
                        value={name.name}
                        onChange={(e) => {
                            name.setName(e.target.value);
                            name.setValidName(true)
                        }}
                    />
                    {!name.validName && <label className="text-xs text-red-400 pl-2">Пользователя не существует</label>}
                </div>

                <div className="mb-2">
                    <label className="block mb-1">
                        Пароль
                    </label>
                    <input
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-600"
                        id="password"
                        type="password"
                        placeholder="Введите пароль"
                        onChange={(e) => {
                            password.setPassword(e.target.value);
                            password.setValidPassword(true)
                        }}
                    />
                    {!password.validPassword && <label className="text-xs text-red-400 pl-2">Некорректный пароль</label>}
                </div>

                <div className="mb-2 text-center">
                    <Button
                        text={loader.localLoader ? 'Проверка данных...' : 'Войти в аккаунт'}
                        disabled={loader.localLoader}
                        type="primary"
                    />
                </div>
            </form>
        </div>
    )
}

