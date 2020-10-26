import React, {createRef, useEffect, useState} from 'react'
import Button from "./Button";
import DatePicker from "react-datepicker";
import workWithServer from "../core/workWithServer";

function ListForEntering({headerRef, setShowBody}) {
  const [startDate, setStartDate] = useState(new Date());
  const printRef = createRef();

  const [listOfPerson, setListOfPerson] = useState([]);
  const [listOfGroup, setListOfGroup] = useState([]);

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
    workWithServer.getListOfGroup().then(setListOfGroup);
    workWithServer.getListOfPerson().then(data => {
      setListOfPerson(data);
      getListOfReport();
    });

  }, []);

  useEffect(() => {
    getListOfReport();
  }, [startDate]);

  const onWorkAll = listOfPerson.filter(el => !el.status_id);

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
      {listOfGroup.map(group => {
        const byGroup = onWorkAll.filter(person => person.group_id === group.id);
        return (
          <>
            {byGroup.length > 0
              ?
              <div style={{pageBreakAfter: 'always'}}>
                <p className="mt-2 text-center font-semibold text-2xl border p-1">{group.name}</p>
                <div className="text-center">
                  <div className="flex">
                    <p className="border p-1 inline-block w-1/12">№</p>
                    <p className="border p-1 inline-block w-6/12">Звание и ФИО</p>
                    <p className="border p-1 inline-block w-5/12">Примечание (время прохода)</p>
                  </div>
                  {byGroup.map((el, index) => {
                    return (
                      <div className="flex">
                        <p className="border p-1 inline-block w-1/12">{index + 1}</p>
                        <p className="border p-1 inline-block w-6/12 text-left">{el.rank_id__name ? el.rank_id__name : 'гп'} {el.name}</p>
                        <p className="border p-1 inline-block w-5/12 text-left"> {el.comment}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
              : <></>
            }
          </>
        )
      })}
    </>
  )
}

export default ListForEntering