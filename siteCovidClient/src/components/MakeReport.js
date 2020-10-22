import React, {createRef, useEffect, useState} from "react";
import workWithServer from "../core/workWithServer";
import Button from "./Button";
import DataTable from "react-data-table-component";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MakeReport({setShowBody}) {
  const [startDate, setStartDate] = useState(new Date());

  const refStatus = createRef();
  const refComment = createRef();

  const [listStatus, setListStatus] = useState([])
  const [listOfPerson, setListOfPerson] = useState([])

  useEffect(() => {
    workWithServer.getListOfPerson().then(setListOfPerson)
    workWithServer.getListOfStatus().then(setListStatus)
  }, [])

  const columns = [
    {
      name: 'Воинское звание',
      selector: 'rank',
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
          : <div>{row.comment}</div>
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
                el.is_editable = false
                el.comment = refComment.current.value
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

  const actions =
    <Button className="text-base" type='warning' text="Создать" onClick={() => {
      workWithServer.setListOfReport({
        'data': listOfPerson,
        'date': startDate
      }
        ).then(() => setShowBody('nothing'))
    }}/>

  return (
    <div>
      <div>
        <Button className="" type='primary' text="Назад" onClick={() => {
          setShowBody('nothing')
        }}/>

        <Button className="" type='primary' text="Использовать данные за:" onClick={() => {
          workWithServer.getListOfReport({'date': startDate}).then(data =>{
            setListOfPerson(prevState => {
              return [...prevState.map(el => {
                let index = data.filter(obj => obj.userForControl_id === el.id)
                if(index.length > 0) return {...el, ...index[0]}
                delete el['comment']
                delete el['status_id']
                return el
              })]
            })
          })
        }}/>

        <DatePicker
          className="rounded border border-blue-700 p-1"
          selected={startDate}
          onChange={date => setStartDate(date)}
          dateFormat="dd-MM-yyyy"
        />
      </div>
      <DataTable
        title={"Сформировать отчет на " + startDate.toLocaleString("ru")}
        columns={columns}
        data={listOfPerson}
        pagination={true}
        contextMessage={{singular: 'строка', plural: 'строк', message: 'выбрано'}}
        actions={actions}
      />
    </div>
  )
}

export default MakeReport