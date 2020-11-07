import React, {createRef, useEffect, useState} from 'react'
import Button, {InputForDatePicker} from "./Button";
import DatePicker from "react-datepicker";
import workWithServer from "../core/workWithServer";

function ListForEntering({headerRef, setShowBody}) {
  const dateToday = new Date();
  dateToday.setDate(dateToday.getDate() + 1);

  const tomorrow = new Date(dateToday);
  const [startDate, setStartDate] = useState(tomorrow);

  const printRef = createRef();

  const [listOfPerson, setListOfPerson] = useState([]);
  const [listOfGroup, setListOfGroup] = useState([]);

  const getListOfReport = () => {
    workWithServer.getListOfReport({'date': startDate}).then(data => {
      setListOfPerson(prevState => prevState.map(el => {
        let index = data.find(obj => obj.userForControl_id === el.id);
        delete el['comment'];
        delete el['status_id'];
        delete el['status_id__name'];
        if (typeof index === 'object') return { ...index,...el};
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

  // const onWorkAll = listOfPerson.filter(el => !el.status_id || el.status_id__name === 'Наряд');

  const onWorkAll = listOfPerson.filter(el => {
    if(startDate.getDay() === 0 || startDate.getDay() === 6){
      return el.status_id__name === 'Наряд'
    }
    return !el.status_id || el.status_id__name === 'Наряд'
  });

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
          dateFormat="dd.MM.yyyy"
          customInput={<InputForDatePicker/>}
        />
      </div>
      <p className="font-bold m-2 text-center text-2xl">Списки на проход на {startDate.toLocaleDateString('ru')}</p>
      {listOfGroup.map(group => {
        const byGroup = onWorkAll.filter(person => person.group_id === group.id);
        const chunk_size = Math.ceil(byGroup.length / 4);
        const groups = byGroup.map(function (e, i) {
          return i % chunk_size === 0 ? byGroup.slice(i, i + chunk_size) : null;
        }).filter(e => e);
        const [mass1, mass2, mass3, mass4] = groups;
        console.log([mass1, mass2, mass3, mass4])
        console.log(groups);

        return (
          <>
            {byGroup.length > 0
              ?
              <div style={{pageBreakAfter: 'always'}}>
                <p className="mt-2 text-center font-semibold text-2xl border p-1">{group.name}</p>
                <div className="text-center text-xs">
                  <div className="flex">
                    <p className="border p-1 inline-block w-1/12">№</p>
                    <p className="border p-1 inline-block w-2/12">Звание и ФИО</p>
                    <p className="border p-1 inline-block w-1/12">№</p>
                    <p className="border p-1 inline-block w-2/12">Звание и ФИО</p>
                    <p className="border p-1 inline-block w-1/12">№</p>
                    <p className="border p-1 inline-block w-2/12">Звание и ФИО</p>
                    <p className="border p-1 inline-block w-1/12">№</p>
                    <p className="border p-1 inline-block w-2/12">Звание и ФИО</p>
                  </div>
                  {mass1.map((el, index) => {
                    const mass2elem = mass2 ? mass2[index] : null;
                    const mass3elem = mass3 ? mass3[index] : null;
                    const mass4elem = mass4 ? mass4[index] : null;
                    return (
                      <div className="flex">
                        <p className="border p-1 inline-block w-1/12">{index + 1}</p>
                        <p
                          className="border p-1 inline-block w-2/12 text-left">{el.rank_id__name ? el.rank_id__name : 'гп'} {el.name}</p>
                        {
                          mass2elem && <>
                            <p className="border p-1 inline-block w-1/12">{chunk_size + index + 1}</p>
                            <p className="border p-1 inline-block w-2/12 text-left">
                              {mass2elem.rank_id__name ? mass2elem.rank_id__name : 'гп'} {mass2elem.name}
                            </p>
                          </>
                        }
                        {
                          mass3elem && <>
                            <p className="border p-1 inline-block w-1/12">{chunk_size * 2 + index + 1}</p>
                            <p className="border p-1 inline-block w-2/12 text-left">
                              {mass3elem.rank_id__name ? mass3elem.rank_id__name : 'гп'} {mass3elem.name}
                            </p>
                          </>
                        }
                        {
                          mass4elem && <>
                            <p className="border p-1 inline-block w-1/12">{chunk_size * 3 + index + 1}</p>
                            <p className="border p-1 inline-block w-2/12 text-left">
                              {mass4elem.rank_id__name ? mass4elem.rank_id__name : 'гп'} {mass4elem.name}
                            </p>
                          </>
                        }
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