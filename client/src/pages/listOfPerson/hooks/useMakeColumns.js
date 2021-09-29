//core
import React from 'react';
// import clsx from "clsx";

//functions
import workWithServer from "../../../core/workWithServer";
import {getNameToGroupSelect} from "../../../core/localWorkWithGroup";
import Button from "../../../components/Button";

export default function useMakeColumns(user, group, post, rank, listWithCity, setShowAlert, setListOfPerson, refs) {
    const user_is_editor = user.profile.find(el => el.page === 'listOfPerson' && el.action === 'edit');
    const columns = [
        {
            name: '№',
            selector: 'id',
            width: '66px',
            cell: (row, index) => <div>{index + 1}</div>,
        },
        {
            name: 'Штатное подразделение',
            selector: 'group_id',
            sortable: true,
            cell: row => {
                return row.is_editable
                    ? <select ref={refs.refGroup_id} className="w-full h-full border-b border-blue-700 bg-white">
                        {
                            group.map(el => <option key={el.id} value={el.id}>
                                {getNameToGroupSelect(el, group)}
                            </option>)
                        }
                    </select>
                    : <div>
                        {
                            getNameToGroupSelect(group.find(el => el.id === parseInt(row.group_id)), group)
                        }
                    </div>
            },
        },
        {
            name: 'Фактическое подразделение',
            selector: 'real_group_id',
            sortable: true,
            cell: row => {
                return row.is_editable
                    ? <select ref={refs.refReal_group_id} className="w-full h-full border-b border-blue-700 bg-white">
                        {
                            group.map(el => <option key={el.id} value={el.id}>
                                {getNameToGroupSelect(el, group)}
                            </option>)
                        }
                    </select>
                    :
                    <div>
                        {
                            getNameToGroupSelect(group.find(el => el.id === parseInt(row.real_group_id)), group)
                        }
                    </div>;
            },
        },
        {
            name: 'Должность',
            selector: 'post_id',
            sortable: true,
            width: '100px',
            cell: row => {
                return row.is_editable
                    ? <select ref={refs.refPost_id} className="w-full h-full border-b border-blue-700 bg-white">
                        {
                            post.map(el => <option key={el.id} value={el.id}>{el.name}</option>)
                        }
                    </select>
                    : <div>
                        {
                            post.filter(el => el.id === Number(row.post_id)).map(el => el.abbr)
                        }
                    </div>;
            },
        },
        {
            name: 'Гр. персонал или в/сл',
            selector: 'rank_id',
            width: '100px',
            sortable: true,
            cell: row => {
                let el_rank = rank.find(el => el.id === Number(row.rank_id));
                return row.is_editable
                    ? <select ref={refs.refRank_id} className="w-full h-full border-b border-blue-700 bg-white">
                        <optgroup label="Гр. персонал">
                            <option value="">ГП</option>
                        </optgroup>
                        <optgroup label="Военнослужащий">
                            {rank.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
                        </optgroup>
                    </select>
                    : <div>{!!el_rank ? el_rank.abbr : ''}</div>;
            },
        },
        {
            name: 'ФИО',
            selector: 'name',
            sortable: true,
            cell: row => {
                return row.is_editable
                    ? <input ref={refs.refName}
                             className="bg-white rounded border outline-none text-base w-full h-full border-blue-700 p-1"
                             onBlur={e => workWithServer
                                 .getNameStatus({'id': row.id, 'name': e.target.value})
                                 .then((e) => row.disabled_name = !e)
                             }
                    />
                    : <div>{row.name}</div>;
            },
        },
        {
            name: 'Почта',
            selector: 'email',
            sortable: true,
            cell: row => {
                return row.is_editable
                    ? <input ref={refs.refEmail}
                             className='bg-white rounded border outline-none text-base w-full h-full border-blue-700 p-1'
                             onBlur={e => {
                                 !!user_is_editor && workWithServer
                                     .getEmailStatus({'id': row.id, 'email': e.target.value})
                                     .then((e) => row.disabled_email = !e)
                             }}

                    />
                    : <div>{row.email}</div>;
            },
        },
        // {
        //     name: 'Телефон',
        //     selector: 'phone',
        //     sortable: true,
        //     cell: row => {
        //         return row.is_editable
        //             ? <input ref={refs.refPhone}
        //                      className="bg-white rounded border outline-none text-base w-full h-full border-blue-700 p-1"
        //             />
        //             : <div>{row.phone}</div>;
        //     },
        // },
        {
            name: 'Город',
            selector: 'city_id',
            width: '150px',
            sortable: true,
            cell: row => {
                return row.is_editable
                    ? <select ref={refs.refCity_id} className="w-full h-full border-b border-blue-700 bg-white">
                        {
                            listWithCity.map(el => <option key={el.id} value={el.id}>{el.name}</option>)
                        }
                    </select>
                    : <div>
                        {
                            (listWithCity.filter(el => el.id === Number(row.city_id))).map(el => el.name)
                        }
                    </div>;
            },
        },
        {
            name: 'Пол',
            selector: 'is_gender',
            width: '100px',
            sortable: true,
            cell: row => {
                return row.is_editable
                    ?
                    <select ref={refs.refIs_gender}
                            className="w-full h-full border-b border-blue-700 bg-white"
                            onChange={e => {
                                if (e.target.value === 'true') {
                                    refs.refIs_woman_with_children.current.value = 'false';
                                    refs.refIs_woman_with_children.current.disabled = true;
                                } else {
                                    refs.refIs_woman_with_children.current.disabled = false;
                                }
                            }}
                    >
                        <option value={true}>М</option>
                        <option value={false}>Ж</option>
                    </select>
                    : <div>
                        {
                            row.is_gender === null ? '' : (!!row.is_gender ? 'М' : 'Ж')
                        }
                    </div>;
            },
        },
        {
            name: 'Женщина с детьми до 14 лет',
            selector: 'is_woman_with_children',
            width: '100px',
            sortable: true,
            cell: row => {
                return row.is_editable
                    ? <select ref={refs.refIs_woman_with_children}
                              className="w-full h-full border-b border-blue-700 bg-white">
                        <option value={true}>Да</option>
                        <option value={false}>Нет</option>
                    </select>
                    : <div>{row.is_woman_with_children ? "Да" : "Нет"}</div>;
            },
        },
    ];
    if(!!user_is_editor) {
        columns.push({
            name: 'Изменить',
            width: '150px',
            selector: 'edit',
            cell: row => {
                return row.is_editable
                    ? <Button type="success" text="Применить" onClick={(e) => {
                        if (!!user_is_editor) {
                            if (row.disabled_name) {
                                // if (row.disabled_name && row.disabled_email) {
                                //     setShowAlert({
                                //         text: 'Указанные ФИО и почта уже присутствуют в списке института',
                                //         type: 'danger',
                                //         time: 3
                                //     })
                                // }
                                // else {
                                    if (row.disabled_name) {
                                        setShowAlert({
                                            text: 'Указанное ФИО уже присутствует в списке института',
                                            type: 'danger',
                                            time: 3
                                        })
                                    }
                                    // if (row.disabled_email) {
                                    //     setShowAlert({
                                    //         text: 'Указанная почта уже присутствует в списке института',
                                    //         type: 'danger',
                                    //         time: 3
                                    //     })
                                    // }
                                // }
                            } else {
                                let is_gender = refs.refIs_gender.current.value === 'true';
                                let is_woman_with_children = refs.refIs_woman_with_children.current.value === 'true';
                                if (!refs.refName.current.value.length) {
                                    setShowAlert({
                                        text: 'Укажите ФИО сотрудника',
                                        type: 'danger',
                                        time: 3
                                    })
                                }
                                // else if (!refs.refEmail.current.value.length) {
                                //     setShowAlert({
                                //         text: 'Укажите почту сотрудника',
                                //         type: 'danger',
                                //         time: 3
                                //     })
                                // }
                                else if (is_gender && is_woman_with_children) {
                                    setShowAlert({
                                        text: 'Противоречие данных "Пол" и "Женщина с детьми до 14 лет"',
                                        type: 'danger',
                                        time: 3
                                    })
                                } else {
                                    setListOfPerson(prev => prev.map(el => {
                                        if (el.id === row.id) {
                                            el.is_editable = false;
                                            el.is_military = !!refs.refRank_id.current.value;
                                            el.rank_id = parseInt(refs.refRank_id.current.value);
                                            el.name = refs.refName.current.value;
                                            el.email = refs.refEmail.current.value;
                                            //el.phone = refs.refPhone.current.value;
                                            el.group_id = parseInt(refs.refGroup_id.current.value);
                                            el.real_group_id = parseInt(refs.refReal_group_id.current.value);
                                            el.post_id = parseInt(refs.refPost_id.current.value);
                                            el.city_id = parseInt(refs.refCity_id.current.value);
                                            el.is_woman_with_children = is_woman_with_children;
                                            el.is_gender = is_gender;
                                            el.is_worked = true;
                                        }
                                        return el;
                                    }))
                                }
                            }
                        }
                    }}/>
                    : <Button type="warning" text="Изменить" onClick={() => {
                        if (!!user_is_editor) {
                            setListOfPerson(prev => prev.map(el => {
                                el.is_editable = el.id === row.id;
                                return el
                            }))
                        }
                    }}/>
            },
        });
    }
    return {
        columns
    }
}
