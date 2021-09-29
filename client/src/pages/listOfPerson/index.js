//core
import React, {createRef, useEffect, useState} from "react";
import DataTable from 'react-data-table-component';
import {connect} from "react-redux";

//components
import Button from "../../components/Button";

//functions
import workWithServer from "../../core/workWithServer";
import {orderList} from "../../core/localWorkWithList";

//redux
import {destroyPerson, initPerson} from "../../redux/actions/actions";

//hooks
import useMakeColumns from "./hooks/useMakeColumns";
import useMakeTableButtons from "./hooks/useMakeTableButtons";
import useCreateRefs from "./hooks/useCreateRefs";


function ListOfPerson({user, post, rank, group, person, myReload, setShowAlert}) {
    const [listWithCity, setListWithCity] = useState([]);
    const [listOfPerson, setListOfPerson] = useState([]);

    const [toggleCleared, setToggleCleared] = useState(false);
    const [searchByName, setSearchByName] = useState('');
    const [selectedRows, setSelectedRows] = useState([]);
    const refs = useCreateRefs();


    useEffect(() => {
        workWithServer.getListOfCity().then(setListWithCity);
    }, []);

    useEffect(() => {
        setListOfPerson(person.map(el => {
            el.is_editable = false;
            return el;
        }))
    }, [person]);

    // TODO fix this shit
    useEffect(() => {
        listOfPerson
            .filter(el => el.is_editable)
            .filter(el => !el.is_deleted)
            .forEach(el => {
                refs.refGroup_id.current.value = Number(el.group_id);
                refs.refReal_group_id.current.value = Number(el.real_group_id);
                refs.refRank_id.current.value = Number(el.rank_id);
                refs.refPost_id.current.value = Number(el.post_id);
                refs.refName.current.value = el.name;
                // refs.refPhone.current.value = el.phone;
                refs.refEmail.current.value = el.email;
                refs.refCity_id.current.value = Number(el.city_id);
                refs.refIs_woman_with_children.current.value = el.is_woman_with_children;
                refs.refIs_gender.current.value = el.is_gender;
                refs.refIs_woman_with_children.current.disabled = !!el.is_gender;
            })
    }, [listOfPerson, refs]);



    const filterListOfPeople = listOfPerson
        .filter(el => !el.is_deleted)
        .filter(el =>
            el.name.toLowerCase().indexOf(searchByName.toLowerCase()) > -1
            || el.name.toLowerCase().indexOf(searchByName.altWordMaker()) > -1
        );

    const {columns} = useMakeColumns(
        user,
        group,
        post,
        rank,
        listWithCity,
        setShowAlert,
        setListOfPerson,
        refs
    );

    const {actions, contextActions} = useMakeTableButtons(
        user,
        listOfPerson,
        setListOfPerson,
        searchByName,
        setSearchByName,
        selectedRows,
        setToggleCleared,
        setShowAlert
    );
    const user_is_editor = user.profile.find(el => el.page === 'listOfPerson' && el.action === 'edit');

    return (
        <div>
            {
                !!user_is_editor && <div>
                    <Button className="" type='success' text="Сохранить" onClick={() => {
                        destroyPerson([]);
                        workWithServer.setListOfPerson({
                            'data': listOfPerson.filter(el => (el.is_deleted || el.is_worked))
                        }).then(data => setListOfPerson(orderList(data, ['~is_military', 'name', 'id'])))
                    }}
                    />
                </div>
            }

            <DataTable
                title="Управление личным составом"
                columns={columns}
                selectableRows={!!user_is_editor}
                data={filterListOfPeople}
                pagination={true}
                onSelectedRowsChange={(state) => setSelectedRows(state.selectedRows)}
                contextMessage={{singular: 'строка', plural: 'строк', message: ''}}
                contextActions={contextActions}
                actions={actions}
                clearSelectedRows={toggleCleared}
                paginationComponentOptions={{
                    rowsPerPageText: 'Строк на странице:',
                    rangeSeparatorText: 'из',
                    noRowsPerPage: false,
                    selectAllRowsItem: false,
                    selectAllRowsItemText: 'Все'
                }}
                paginationPerPage={100}
                paginationRowsPerPageOptions={[25, 50, 100]}
            />
        </div>
    )
}

function mapStateToProps(state) {
    return {
        user: state.user,
        rank: state.rank,
        group: state.group,
        person: state.person,
        post: state.post
    }
}

function mapDispatchToProps(dispatch) {
    return {
        initPerson: person => dispatch(initPerson(person)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListOfPerson);

