//core
import React, {useState} from 'react'

//components
import Button from "../../../components/Button";
import workWithServer from "../../../core/workWithServer";


export default function useMakeTables(user, listOfPerson, setListOfPerson, searchByName, setSearchByName, selectedRows, setToggleCleared, setShowAlert) {

    const [idNewRow, setIdNewRow] = useState(-1);

    const actions = (<>
        <input className="bg-white m-2 rounded border outline-none text-base w-56 h-full border-blue-700 p-1"
               placeholder="Поиск по имени..."
               value={searchByName}
               onChange={e => setSearchByName(e.target.value)}
        />
        {
            !!user.is_editor &&
            <Button
                className="text-base"
                type="warning"
                text="Добавить"
                onClick={() => {
                    setListOfPerson([{
                        id: idNewRow,
                        is_military: true,
                        name: '',
                        phone: '',
                        group_id: null,
                        real_group_id: null,
                        post_id: null,
                        is_woman_with_children: false,
                        is_gender: true,
                        is_editable: true,
                        disabled_name: false,
                        disabled_email: false,

                    }, ...listOfPerson.map((el => {
                        el.is_editable = false;
                        return el
                    }))]);
                    setIdNewRow(prevState => prevState - 1)
                }}
            />
        }
    </>);

    const contextActions = <Button className="text-base" type="danger" text="Удалить" onClick={() => {
        if (!!user.is_editor) {
            const idOfRows = selectedRows.map(el => el.id);
            workWithServer.setListOfPerson({
                'data': listOfPerson.map((el) => {
                    if (idOfRows.indexOf(el.id) !== -1) {
                        el.is_deleted = true
                    }
                    return el;
                })
            });
            setListOfPerson(listOfPerson.map((el) => {
                if (idOfRows.indexOf(el.id) !== -1) {
                    el.is_deleted = true
                }
                return el;
            }));

            setToggleCleared(prev => !prev)
        }
        else {
            setShowAlert({
                text: 'Вы не можете удалять записи',
                type: 'danger',
                time: 3
            })
        }
    }}/>;
    return {
        actions,
        contextActions
    }
}