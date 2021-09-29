//core
import React, {createRef, useEffect, useState} from 'react'
import DatePicker from "react-datepicker";
import {connect} from "react-redux";

//components
import Button from "../../components/Button";

//functions
import workWithServer from "../../core/workWithServer";
import {initUser} from "../../redux/actions/actions";

function Delegation({user, initUser}) {
    const filter_delegations_user = user.delegations_user
        ? user.delegations_user.filter(el => {
            if (el.user === user.id) {
                return false
            }
            if (user.delegated_users) {
                const search = user.delegated_users.find(delegated => delegated.id === el.id);
                if (search) {
                    return false
                }
            }
            if (user.delegation_user && user.delegation_user.other_user) {
                const search = user.delegation_user.other_user.find(delegated => delegated.id === el.id);
                if (search) {
                    return false
                }
            }
            return true
        })
        : [];

    return <div className="grid grid-cols-2 divide-gray-200 divide-x border-b border-gray-200 p-4">
        <div className="p-2">
            <p className="m-4 text-center font-bold">Список пользователей, которым делегированы Ваши права</p>
            {
                user.delegated_users && user.delegated_users.length > 0
                    ? user.delegated_users.map((el, index) => <p
                        className=" border border-green-200 my-2 flex h-8"
                        key={el.user}
                    >
                        <span className="my-auto ml-2">
                            {index + 1}. {
                            el.user__first_name
                                ? el.user__first_name + ' ' + el.user__last_name
                                : el.user__username}
                        </span>
                        <button
                            className="ml-auto my-auto bg-red-400 border-red-400 h-full w-8"
                            onClick={() => {
                                const success_try = window.confirm("Вы уверены, что хотите удалить права?");

                                if (success_try) {
                                    workWithServer.set_user_to_work({
                                        id: el.id,
                                        // type: 'set'
                                    }).then(data => {
                                        const delegated_users = user.delegated_users.filter(delegated => delegated.id !== el.id);
                                        initUser({...user, delegated_users})
                                    })
                                }

                            }}
                        >x
                        </button>

                    </p>)
                    : <p className="text-center">Вы еще не делегировали свои права</p>
            }

            <p className="m-4 text-center font-bold">Список пользователей, которым возможо делегировать Ваши права</p>
            {
                filter_delegations_user.length > 0
                    ? filter_delegations_user
                        .map((el, index) => <p
                            className=" border border-green-200 my-2 flex h-8"
                            key={el.user}
                        >
                            <span className="my-auto ml-2">
                                {index + 1}. {
                                el.user__first_name
                                    ? el.user__first_name + ' ' + el.user__last_name
                                    : el.user__username}
                            </span>
                            <button
                                className="ml-auto my-auto bg-green-400 border-green-400 h-full w-8"

                                onClick={() => {
                                    const success_try = window.confirm("Вы уверены, что хотите дать права?");

                                    if (success_try) {
                                        workWithServer.set_user_to_work({
                                            id: el.id,
                                            type: 'set'
                                        }).then(data => {
                                            const delegated_users = user.delegated_users ? [...user.delegated_users, el] : [el];
                                            initUser({...user, delegated_users})
                                        })
                                    }

                                }}
                            >+
                            </button>

                        </p>)
                    : <p className="text-center">Вам некому делегировать свои права</p>
            }

        </div>
        <div className="p-2">
            <p className="m-4 text-center font-bold">Пользователь, делегирующий свои права и список прав</p>
            {
                user.delegation_user
                    ? <>
                        <p>
                            Пользователь <span className="font-bold">{user.delegation_user.username}</span> предоставил
                            Вам свои права доступа.
                        </p>
                        {
                            user.delegation_user.other_user.length > 1 && <>
                                <p className="my-2">Пользователи, имеющие такие же права доступа:</p>
                                {

                                    user.delegation_user.other_user
                                        .filter(other => other.user !== user.id)
                                        .map((other, index) => <p
                                            className=" border border-green-200 my-2 flex h-8"
                                            key={other.user}
                                        >
                                    <span className="my-auto ml-2">
                                        {index + 1}. {
                                        other.user__first_name
                                            ? other.user__first_name + ' ' + other.user__last_name
                                            : other.user__username}
                                    </span>
                                            <button
                                                className="ml-auto my-auto bg-red-400 border-red-400 h-full w-8"
                                                onClick={() => {
                                                    const success_try = window.confirm("Вы уверены, что хотите удалить права?");

                                                    if (success_try) {
                                                        workWithServer.set_user_to_work({
                                                            id: other.id,
                                                            // type: 'set'
                                                        }).then(data => {
                                                            const other_user = user.delegation_user.other_user.filter(delegated => delegated.id !== other.id);
                                                            initUser({
                                                                ...user,
                                                                delegation_user: {...user.delegation_user, other_user}
                                                            })
                                                        })
                                                    }

                                                }}
                                            >x
                                            </button>

                                        </p>)
                                }
                            </>
                        }
                        <p className="m-4 text-center font-bold">Список пользователей, которым возможо делегировать
                            права <span className="font-bold">"{user.delegation_user.username}</span>"</p>
                        {
                            filter_delegations_user.length > 0
                                ? filter_delegations_user.map((other, index) => <p
                                    className=" border border-green-200 my-2 flex h-8"
                                    key={other.user}
                                >
                                    <span className="my-auto ml-2">
                                        {index + 1}. {
                                        other.user__first_name
                                            ? other.user__first_name + ' ' + other.user__last_name
                                            : other.user__username}
                                    </span>
                                    <button
                                        className="ml-auto my-auto bg-green-400 border-green-400 h-full w-8"
                                        onClick={() => {
                                            const success_try = window.confirm("Вы уверены, что хотите дать права?");

                                            if (success_try) {
                                                workWithServer.set_user_to_work({
                                                    id: other.id,
                                                    profile_id: user.delegation_user.profile_id,
                                                    type: 'set'
                                                }).then(data => {
                                                    const other_user = [...user.delegation_user.other_user, other];
                                                    initUser({
                                                        ...user,
                                                        delegation_user: {...user.delegation_user, other_user}
                                                    })
                                                })
                                            }

                                        }}
                                    >+
                                    </button>

                                </p>)
                                : <p className="text-center">Вам некому делегировать свои права</p>
                        }
                        <div className="flex">
                            <Button
                                className="mt-4 mx-auto"
                                type="danger"
                                text='Удалить права'
                                onClick={() => {
                                    const success_try = window.confirm("Вы уверены, что хотите удалить данные права");

                                    if (success_try) {
                                        workWithServer.set_user_to_work({
                                            // id: user.
                                        }).then(data => {
                                            initUser({...user, delegation_user: null})
                                        })
                                    }

                                }}
                            />
                        </div>

                    </>
                    : <p className="text-center">Вам не предоставлено сторонних прав</p>
            }

        </div>
    </div>
}

function mapStateToProps(state) {
    return {
        user: state.user,
        holiday: state.holiday,
        rank: state.rank,
        group: state.group,
        person: state.person,
        status: state.status
    }
}

function mapDispatchToProps(dispatch) {
    return {
        initUser: user => dispatch(initUser(user)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Delegation);