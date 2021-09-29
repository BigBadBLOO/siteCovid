//core
import React, {useState} from "react";
import {Link, useLocation} from "react-router-dom";
import {connect} from "react-redux";
import clsx from "clsx";

//components
import Button from "./Button";

//functions
import workWithServer from "../core/workWithServer";

//redux
import {initUser} from "../redux/actions/actions";

// ulr media files
import doc from '../documentation.docx'
import doc_control from '../doc_control.docx'
import main_logo from '../fon.png'

function Header({user, initUser, headerRef, setShowAlert, showAlert}) {
    const [changePassword, setChangePassword] = useState(false);
    const [password, SetPassword] = useState('');
    const location = useLocation();

    const logOut = () => {
        workWithServer.logOut().then(() => initUser({...user, username: ''}))
    };

    const href_to_doc = user.profile.find(el => el.action === 'edit') ? doc_control : doc;

    return (
        <>
            <div ref={headerRef} className="p-3 border-b flex justify-between mb-2">
                {showAlert !== null && <>
                    <div className="fixed w-screen top-0 left-0 bg-white ">
                        <div className={clsx("w-full h-full p-5 bg-opacity-75 hover:bg-opacity-100", {
                            "bg-blue-600 ": showAlert.type === 'primary',
                            "bg-green-600": showAlert.type === 'success',
                            "bg-yellow-600": showAlert.type === 'warning',
                            "bg-red-600": showAlert.type === 'danger',
                        })}
                             onClick={() => {
                                 if (showAlert !== null && !showAlert.time) {
                                     setShowAlert(null)
                                 }
                             }}
                        >
                            <p className="text-white text-center text-2xl">{showAlert.text}</p>
                        </div>
                    </div>
                </>
                }
                <div className="flex">
                    <a className="mr-2" href="http://web/">
                        <img src={main_logo} alt="ФГКУ «12 ЦНИИ»"/>
                    </a>

                    <span className="my-auto m-2 border rounded border-blue-600">

                    <Link to="/"> <Button className={clsx({
                        'underline': location.pathname === '/'
                    })} type='link' text="Главная"/></Link>

                        {
                            user.user_group && <>
                                {
                                    user.pages.indexOf('listOfPerson') !== -1 && <Link to="/listOfPerson">
                                        <Button
                                            className={clsx({
                                                'underline': location.pathname === '/listOfPerson'
                                            })}
                                            type='link'
                                            text="Управление л/с"
                                        />
                                    </Link>
                                }

                                {
                                    user.pages.indexOf('listOfRecords') !== -1 && <Link to="/listOfRecords">
                                        <Button
                                            className={clsx({
                                                'underline': location.pathname === '/listOfRecords'
                                            })}
                                            type='link'
                                            text="Строевая записка"
                                        />
                                    </Link>
                                }

                                {
                                    user.pages.indexOf('listOfDuty') !== -1 && <Link to="/listOfDuty">
                                        <Button
                                            className={clsx({
                                                'underline': location.pathname === '/listOfDuty'
                                            })}
                                            type='link'
                                            text="Наряды"
                                        />
                                    </Link>
                                }
                                {
                                    user.pages.indexOf('listForEntering') !== -1 && <Link to="/listForEntering">
                                        <Button
                                            className={clsx({
                                                'underline': location.pathname === '/listForEntering'
                                            })}
                                            type='link'
                                            text="Списки на проход"
                                        />
                                    </Link>
                                }
                                {
                                    user.pages.indexOf('seeReport') !== -1 && <Link to="/seeReport">
                                        <Button
                                            className={clsx({
                                                'underline': location.pathname === '/seeReport'
                                            })}
                                            type='link'
                                            text="Справка доклад"
                                        />
                                    </Link>
                                }

                                {
                                    user.pages.indexOf('overtime') !== -1 && <Link to="/overtime">
                                        <Button
                                            className={clsx({
                                                'underline': location.pathname === '/overtime'
                                            })}
                                            type='link'
                                            text="Переработка"
                                        />
                                    </Link>
                                }
                                {
                                    user.pages.indexOf('delegation') !== -1 && <Link to="/delegation">
                                        <Button
                                            className={clsx({
                                                'underline': location.pathname === '/delegation'
                                            })}
                                            type='link'
                                            text="Делегирование"
                                        />
                                    </Link>
                                }


                                {/*<Link to="/justification"><Button className={clsx({*/}
                                {/*'underline': location.pathname === '/justification',*/}
                                {/*'no-underline': location.pathname !== '/justification',*/}
                                {/*})} type='link' text="Обоснование"/></Link>*/}

                                {/*<Button className={clsx({*/}
                                {/*'underline': showBody === 'statistics',*/}
                                {/*'no-underline': showBody !== 'statistics',*/}
                                {/*})} type='link' text="Статистика"/>*/}
                            </>
                        }

                    </span>

                </div>
                <div className="float-right">
                    <span className="my-auto p-2">
                        {user.username}
                    </span>

                    {/*{!changePassword &&*/}
                    {/*<a href={href_to_doc} className="my-auto p-2 no-underline hover:underline text-blue-500">*/}
                    {/*Инструкция*/}
                    {/*</a>*/}
                    {/*}*/}

                    {/*{!user.is_control && (!changePassword*/}
                    {/*? <Button className="" type='warning' onClick={() => {*/}
                    {/*setChangePassword(true)*/}
                    {/*}} text="Сменить пароль"/>*/}
                    {/*: (*/}
                    {/*<>*/}
                    {/*<input type="text" className="rounded border border-blue-700 p-1 w-32 m-2"*/}
                    {/*value={password}*/}
                    {/*onChange={e => SetPassword(e.target.value)}*/}
                    {/*placeholder="Введите новый пароль..."/>*/}
                    {/*<Button type='success' onClick={() => {*/}
                    {/*if (password.trim().length > 6) {*/}
                    {/*setChangePassword(false);*/}
                    {/*workWithServer.changePassword({'password': password}).then(() => {*/}
                    {/*initUser({...user, username: ''})*/}
                    {/*});*/}
                    {/*}*/}
                    {/*setShowAlert({text: 'Ошибка! Введите корректный новый пароль...', type: 'danger', time: 2})*/}
                    {/*}} text="Сохранить"/>*/}
                    {/*<Button type='danger' className="" onClick={() => {*/}
                    {/*setChangePassword(false);*/}
                    {/*SetPassword('');*/}
                    {/*}} text="Отмена"/>*/}
                    {/*</>*/}
                    {/*))*/}
                    {/*}*/}
                    {/*{!changePassword && <Button className="" type='danger' onClick={logOut} text="Выйти"/>}*/}

                    <Button className="" type='danger' onClick={logOut} text="Выйти"/>
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