import React, {createRef, useEffect, useState} from 'react'
import Button from "./Button";
import DatePicker from "react-datepicker";
import workWithServer from "../core/workWithServer";

function ListForEntering({headerRef, setShowBody}) {
  const [startDate, setStartDate] = useState(new Date());
  const printRef = createRef();

  const [listOfPerson, setListOfPerson] = useState([]);

  const getListOfReport = () => {
    workWithServer.getListOfReport({'date': startDate}).then(data => {
      setListOfPerson(prevState => prevState.map(el => {
        let index = data.filter(obj => obj.userForControl_id === el.id);
        if (index.length > 0) return {...el, ...index[0]};
        delete el['comment'];
        delete el['status_id'];
        return el
      }))
    })
  };

  useEffect(() => {
    workWithServer.getListOfPerson().then(data => {
      setListOfPerson(data);
      getListOfReport();
    });
  }, []);

  useEffect(() => {
    getListOfReport();
  }, [startDate]);

  console.log(listOfPerson);
  const onWorkAll = listOfPerson.filter(el => el.status_id === null || el.status_id === undefined);

  return (
    <>
      <div ref={printRef}>
        <Button className="" type='primary' text="Назад" onClick={() => {
          setShowBody('nothing')
        }}/>
        <Button className="" type='success' text="Распечатать" onClick={() => {
          printRef.current.classList.add('hidden');
          headerRef.current.classList.add('hidden');
          window.print();
          printRef.current.classList.remove('hidden');
          headerRef.current.classList.remove('hidden');
        }}/>
        <DatePicker
          className="rounded border border-blue-700 p-1"
          selected={startDate}
          onChange={date => setStartDate(date)}
          dateFormat="dd-MM-yyyy"
        />
      </div>
      <p className="font-bold m-2 text-center text-2xl">Списки на проход на {startDate.toLocaleDateString('ru')}</p>
      <div className="grid grid-cols-5  mt-1 text-center">
        <span className="border p-1">№</span>
        <span className="border p-1">Подразделение</span>
        <span className="border p-1">Воиское звание</span>
        <span className="border p-1">Фамилия, иницалы</span>
        <span className="border p-1">Примечание</span>
        {onWorkAll.map((el, index) => {
          return (
            <>
              <span className="border p-1">{index + 1}</span>
              <span className="border p-1">{el.group_id__name}</span>
              <span className="border p-1">{el.rank}</span>
              <span className="border p-1">{el.name}</span>
              <span className="border p-1"> {el.comment}</span>
            </>
          )
        })}
      </div>
    </>
  )
}

export default ListForEntering