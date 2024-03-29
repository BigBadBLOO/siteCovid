//core
import React, {createRef, useState} from "react";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";

//components
import Button, {InputForDatePicker} from "../../components/Button";

//functions
import workWithServer from "../../core/workWithServer";

//styles
import "react-datepicker/dist/react-datepicker.css";


function MakeReport({}) {
  const [startDate, setStartDate] = useState(new Date());

  const refStatus = createRef();
  const refComment = createRef();

  const listStatus = [];
  const [listOfPerson, setListOfPerson] = useState([]);

  const [searchByName, setSearchByName] = useState('');

  const filterListOfPeople = listOfPerson.filter(el => el.name.indexOf(searchByName) > -1);

  const dataByday = () => {
    workWithServer.getListOfReport({'date': startDate}).then(data => {
      setListOfPerson(prevState => {
        return [...prevState.map(el => {
          let index = data.filter(obj => obj.userForControl_id === el.id);
          if (index.length > 0) return {...el, ...index[0]};
          delete el['comment'];
          delete el['status_id'];
          return el
        })]
      })
    })
  };

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
      name: 'Воинское звание',
      selector: 'rank_id__name',
      sortable: true,
    },
    {
      name: 'ФИО',
      selector: 'name',
      sortable: true,
    },
    {
      name: 'Статус',
      selector: ' status_id',
      sortable: true,
      cell: row => {
        const elem = row.is_editable
          ? <select ref={refStatus} className="w-full h-full border-b border-blue-700 bg-white">
            <option key={-1} value="-1">Сбросить статус</option>
            {listStatus.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
          </select>
          : <div>{(listStatus.filter(el => el.id === Number(row.status_id))).map(el => el.name)}</div>
        if (row.is_editable && row.status_id) setTimeout(() => refStatus.current.value = row.status_id, 200)
        return elem
      },
    },
    {
      name: 'Комментарий',
      selector: 'comment',
      sortable: true,
      cell: row => {
        const elem = row.is_editable
          ? <input ref={refComment} className="w-full h-full border-b border-blue-700 bg-white"/>
          : <div>{row.comment}</div>;
        if (row.is_editable) setTimeout(() => refComment.current.value = row.comment ? row.comment : '', 200)
        return elem
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
                el.comment = refComment.current.value;
                el.status_id = refStatus.current.value
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

  const actions = (
    <>
      <input  className="bg-white rounded border border-blue-600 outline-none text-base p-1" placeholder="поиск по имени..." value={searchByName}
              onChange={e => setSearchByName(e.target.value)}/>
    </>);
  return (
    <div>
      <div>
        <Button className="text-base" type='success' text="Сохранить" onClick={() => {
          workWithServer.setListOfReport({
              'data': listOfPerson,
              'date': startDate
            })
        }}/>

        <Button className="" type='primary' text="Использовать данные за:" onClick={() => {
          dataByday();
        }}/>

        <DatePicker
          className="border-blue-700 rounded border"
          selected={startDate}
          showWeekNumbers
          onChange={date => setStartDate(date)}
          dateFormat="dd.MM.yyyy"
          customInput={<InputForDatePicker/>}
          locale="ru"
        />
      </div>
      <DataTable
        title={"Сформировать отчет на " + startDate.toLocaleString("ru")}
        columns={columns}
        data={filterListOfPeople}
        pagination={true}
        contextMessage={{singular: 'строка', plural: 'строк', message: 'выбрано'}}
        paginationComponentOptions = {{
          rowsPerPageText: 'Строк на странице:',
          rangeSeparatorText: 'из',
          noRowsPerPage: false,
          selectAllRowsItem: false,
          selectAllRowsItemText: 'Все'
        }}
        actions={actions}
        paginationPerPage={100}
        paginationRowsPerPageOptions={[25,50,100]}
      />
    </div>
  )
}

export default MakeReport
