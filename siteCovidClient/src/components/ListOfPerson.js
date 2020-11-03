import React, {createRef, useEffect, useState} from "react";
import Button from "./Button";
import DataTable from 'react-data-table-component';
import workWithServer from "../core/workWithServer";

export default function ListOfPerson({setShowBody}) {
  const [toggleCleared, setToggleCleared] = useState(false);
  const [idNewRow, setIdNewRow] = useState(-1);

  const [listWithCity, setListWithCity] = useState([]);
  const [listWithRank, setListWithRank] = useState([]);
  const [listOfPerson, setListOfPerson] = useState([]);
  const [listOfGroup, setListOfGroup] = useState([]);
  const [listOfPost, setListOfPost] = useState([]);

  const [searchByName, setSearchByName] = useState('');

  let selectedRows = [];

  let refIs_military = createRef();
  let refGroup_id = createRef();
  let refPost_id = createRef();
  let refRank_id = createRef();
  let refName = createRef();
  let refCity_id = createRef();
  let refIs_woman_with_children = createRef();

  useEffect(() => {
    workWithServer.getListOfCity().then(setListWithCity);
    workWithServer.getListOfPerson().then(setListOfPerson);
    workWithServer.getListOfRank().then(setListWithRank);
    workWithServer.getListOfGroup().then(setListOfGroup);
    workWithServer.getListOfPost().then(setListOfPost);
  }, []);

  useEffect(() => {
    listOfPerson.filter(el => el.is_editable).map(el => {
      refIs_military.current.value = el.is_military.toString();
      refGroup_id.current.value = Number(el.group_id);
      refRank_id.current.value = Number(el.rank_id);
      refPost_id.current.value = Number(el.post_id);
      refName.current.value = el.name;
      refCity_id.current.value = Number(el.city_id);
      refIs_woman_with_children.current.value = el.is_woman_with_children.toString()
    })
  }, [listOfPerson]);

  const filterListOfPeople = listOfPerson.filter(el => el.name.toLowerCase().indexOf(searchByName.toLowerCase()) > -1);

  const columns = [
    {
      name: '№',
      selector: 'id',
      sortable: true,
      cell: (row, index) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      name: 'Подразделение',
      selector: 'group_id',
      sortable: true,
      cell: row => {
        return row.is_editable
          ? <select ref={refGroup_id} className="w-full h-full border-b border-blue-700 bg-white">
            {listOfGroup.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
          </select>
          : <div>{(listOfGroup.filter(el => el.id === Number(row.group_id))).map(el => el.name)}</div>;
      },
    },
    {
      name: 'Должность',
      selector: 'post_id',
      sortable: true,
      cell: row => {
        return row.is_editable
          ? <select ref={refPost_id} className="w-full h-full border-b border-blue-700 bg-white">
            {listOfPost.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
          </select>
          : <div>{(listOfPost.filter(el => el.id === Number(row.post_id))).map(el => el.name)}</div>;
      },
    },
    {
      name: 'Военнослужащий или гр. персонал',
      selector: 'is_military',
      sortable: true,
      cell: row => {
        return row.is_editable
          ?
          <select ref={refIs_military} className="w-full h-full border-b border-blue-700 bg-white">
            <option value={true}>Военнослужащий</option>
            <option value={false}>Гр. персонал</option>
          </select>
          : <div>{row.is_military ? "Военнослужащий" : "Гр. персонал"}</div>;
      },
    },
    {
      name: 'Воинское звание',
      selector: 'rank_id',
      sortable: true,
      cell: row => {
        return row.is_editable
          ? <select ref={refRank_id} className="w-full h-full border-b border-blue-700 bg-white">
            <option value="">Сбросить воинское звание</option>
            {listWithRank.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
          </select>
          : <div>{(listWithRank.filter(el => el.id === Number(row.rank_id))).map(el => el.name)}</div>;
      },
    },
    {
      name: 'ФИО',
      selector: 'name',
      sortable: true,
      cell: row => {
        return row.is_editable
          ? <input ref={refName} className="w-full h-full border-b border-blue-700 bg-white"/>
          : <div>{row.name}</div>;
      },
    },
    {
      name: 'Город',
      selector: 'city_id',
      sortable: true,
      cell: row => {
        return row.is_editable
          ? <select ref={refCity_id} className="w-full h-full border-b border-blue-700 bg-white">
            {listWithCity.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
          </select>
          : <div>{(listWithCity.filter(el => el.id === Number(row.city_id))).map(el => el.name)}</div>;
      },
    },
    {
      name: 'Является ли женщиной с детьми до 14 лет?',
      selector: 'is_woman_with_children',
      sortable: true,
      cell: row => {
        return row.is_editable
          ? <select ref={refIs_woman_with_children} className="w-full h-full border-b border-blue-700 bg-white">
            <option value={true}>Да</option>
            <option value={false}>Нет</option>
          </select>
          : <div>{row.is_woman_with_children ? "Да" : "Нет"}</div>;
      },
    },
    {
      name: 'Изменить',
      selector: 'edit',
      sortable: true,
      cell: row => {
        return row.is_editable
          ? <Button type="warning" text="Применить" onClick={() => {
            setListOfPerson(prev => prev.map(el => {
              if (el.id === row.id) {
                el.is_editable = false;
                el.is_military = refIs_military.current.value === 'true';
                el.rank_id = refRank_id.current.value;
                el.name = refName.current.value;
                el.group_id = refGroup_id.current.value;
                el.post_id = refPost_id.current.value;
                el.city_id = refCity_id.current.value;
                el.is_woman_with_children = refIs_woman_with_children.current.value === 'true'
              }
              return el
            }))
          }}/>
          : <Button type="warning" text="Изменить" onClick={() => {
            setListOfPerson(prev => prev.map(el => {
              el.is_editable = el.id === row.id;
              return el
            }))
          }}/>
      },
    },
  ];

  const selectedRow = (state) => {
    selectedRows = state.selectedRows
  };

  const actions = (
    <>
      <input className="bg-white rounded border border-blue-600 outline-none text-base p-1"
             placeholder="поиск по имени..." value={searchByName}
             onChange={e => setSearchByName(e.target.value)}/>
      <Button className="text-base" type="primary" text="Добавить" onClick={() => {
        setListOfPerson([{
          id: idNewRow,
          is_military: true,
          name: '',
          group_id: '',
          post_id: '',
          is_woman_with_children: false,
          is_editable: true
        }, ...listOfPerson.map((el => {
          el.is_editable = false;
          return el
        }))]);
        setIdNewRow(prevState => prevState - 1)
      }}/>
    </>);

  const contextActions = <Button className="text-base" type="danger" text="Удалить" onClick={() => {
    const idOfRows = selectedRows.map((el) => el.id);
    setListOfPerson(listOfPerson.filter((el) => idOfRows.indexOf(el.id) === -1));
    setToggleCleared(!toggleCleared)
  }}/>;


  return (
    <div>
      <div>
        <Button className="" type='primary' text="Назад" onClick={() => {
          setShowBody('nothing')
        }}/>
        <Button className="" type='success' text="Сохранить" onClick={() => {
          workWithServer.setListOfPerson({'data': listOfPerson}).then(() => setShowBody('nothing'))
        }}/>
      </div>
      <DataTable
        title="Управление личным составом центра"
        columns={columns}
        selectableRows
        data={filterListOfPeople}
        pagination={true}
        onSelectedRowsChange={selectedRow}
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

