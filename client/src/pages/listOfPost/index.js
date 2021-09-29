//core
import React, {createRef, useState} from "react";
import DataTable from 'react-data-table-component';

//components
import Button from "../../components/Button";


export default function ListOfPost({}) {
  const [toggleCleared, setToggleCleared] = useState(false);
  const [idNewRow, setIdNewRow] = useState(-1);

  const [listOfPost, setListOfPost] = useState([]);

  let selectedRows = [];

  let refGroup_id = createRef();
  let refName = createRef();
  let refPosition = createRef();

  // useEffect(() => {
  //   // workWithServer.getListOfGroup().then(setListOfGroup);
  //   // workWithServer.getListOfPost().then(setListOfPost);
  // }, []);

  // useEffect(() => {
  //   listOfPost.filter(el => el.is_editable).map(el => {
  //     refGroup_id.current.value = Number(el.group_id);
  //     refName.current.value = el.name;
  //     refPosition.current.value = Number(el.position);
  //     return el;
  //   })
  // }, [listOfPost]);

  const columns = [
    {
      name: '№',
      selector: 'id',
      sortable: true,
      cell: (row, index) => {
        return <div>{index + 1}</div>;
      },
    },
    // {
    //   name: 'Подразделение',
    //   selector: 'group_id',
    //   sortable: true,
    //   cell: row => {
    //     return row.is_editable
    //       ? <select ref={refGroup_id} className="w-full h-full border-b border-blue-700 bg-white">
    //         {listOfGroup.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
    //       </select>
    //       : <div>{(listOfGroup.filter(el => el.id === Number(row.group_id))).map(el => el.name)}</div>;
    //   },
    // },
    {
      name: 'Должность',
      selector: 'name',
      sortable: true,
      cell: row => {
        return row.is_editable
          ? <input ref={refName} className="w-full h-full border-b border-blue-700 bg-white"/>
          : <div>{row.name}</div>;
      },
    },
    {
      name: 'Порядковый номер',
      selector: 'position',
      sortable: true,
      cell: row => {
        return row.is_editable
          ? <input ref={refPosition} className="w-full h-full border-b border-blue-700 bg-white"/>
          : <div>{row.position}</div>;
      },
    },
    {
      name: 'Изменить',
      selector: 'edit',
      sortable: true,
      cell: row => {
        return row.is_editable
          ? <Button type="warning" text="Применить" onClick={() => {
            setListOfPost(prev => prev.map(el => {
              if (el.id === row.id) {
                el.is_editable = false;
                el.name = refName.current.value;
                el.group_id = refGroup_id.current.value;
                el.position = refPosition.current.value;
              }
              return el
            }))
          }}/>
          : <Button type="warning" text="Изменить" onClick={() => {
            setListOfPost(prev => prev.map(el => {
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
      <Button className="text-base" type="primary" text="Добавить" onClick={() => {
        setListOfPost([{
          id: idNewRow,
          is_editable: true,
          name: '',
          group_id: '',
          position: '',
        }, ...listOfPost.map((el => {
          el.is_editable = false;
          return el
        }))]);
        setIdNewRow(prevState => prevState - 1)
      }}/>
    </>);

  const contextActions = <Button className="text-base" type="danger" text="Удалить" onClick={() => {
    const idOfRows = selectedRows.map((el) => el.id);
    setListOfPost(listOfPost.filter((el) => idOfRows.indexOf(el.id) === -1));
    setToggleCleared(!toggleCleared)
  }}/>;


  return (
    <div>
      <div>
        <Button className="" type='success' text="Сохранить" onClick={() => {
          // workWithServer.setListOfPost({'data': listOfPost}).then(() => setShowBody('nothing'))
        }}/>
      </div>
      <DataTable
        title="Управление должностями подразделения"
        columns={columns}
        selectableRows
        data={listOfPost}
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

