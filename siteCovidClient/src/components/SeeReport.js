import React, {createRef, useEffect, useState} from "react";
import Button from "./Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import workWithServer from "../core/workWithServer";


function SeeReport({setShowBody, headerRef}) {
  const [startDate, setStartDate] = useState(new Date());
  const printRef = createRef();

  const [listOfPerson, setListOfPerson] = useState([]);
  const [listOfCity, setListOfCity] = useState([]);

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
    workWithServer.getListOfCity().then(setListOfCity);
  }, []);

  useEffect(() => {
    getListOfReport();
  }, [startDate]);

  const onWorkAll = listOfPerson.filter(el => !el.status_id);
  const onWorkMilitary = onWorkAll.filter(el => el.is_military);
  const onWorkPeople = onWorkAll.filter(el => !el.is_military);
  const onWorkMilitaryWithChildren = onWorkMilitary.filter(el => el.is_woman_with_children);
  const onWorkPeopleWithChildren = onWorkPeople.filter(el => el.is_woman_with_children);

  const withDisease = listOfPerson.filter(el => !!el.status_id);

  const withNoInfectionAmb = withDisease.filter(el => el.status_id__name === 'Неинфекционное заболевание, амбулаторно');
  const withNoInfectionStat = withDisease.filter(el => el.status_id__name === 'Неинфекционное заболевание, стационарно');

  const withRespiratornoAmb = withDisease.filter(el => el.status_id__name === 'Респираторное заболевание, амбулаторно');
  const withRespiratornoStat = withDisease.filter(el => el.status_id__name === 'Респираторное заболевание, стационарно');

  const withKarantin = listOfPerson.filter(el => el.status_id__name === 'Карантин');

  const withCovidAmb = withDisease.filter(el => el.status_id__name === 'Коронавирус, амбулаторно');
  const withCovidStat = withDisease.filter(el => el.status_id__name === 'Коронавирус, стационарно');

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
          onChange={setStartDate}
          dateFormat="dd-MM-yyyy"
        />
      </div>

      <div className="m-4">
        <p className="text-center">
          СПРАВКА-ДОКЛАД <br/>
          о состоянии дел в ФГКУ "12 ЦНИИ" Минобороны России <br/>
          на {startDate.toLocaleString("ru")}
        </p>
        <p className="font-bold">
          1. Находятся на службе:
        </p>
        <p>
          Всего <b>{onWorkAll.length}</b>, в том числе: <br/>
          военнослужащие - <b>{onWorkMilitary.length}</b> чел., из них женщин с детьми до 14 лет
          - {onWorkMilitaryWithChildren.length} чел. <br/>
          гражданские - <b>{onWorkPeople.length}</b> чел., из них женщин с детьми до 14 лет
          - {onWorkPeopleWithChildren.length} чел.
        </p>
        <div className="grid grid-cols-3 mt-1 text-center">
          <span className="border p-1"> ППД</span>
          <span className="border p-1"> Военнослужащих</span>
          <span className="border p-1"> Гр. персонала</span>
          {listOfCity.map(el => {
            return (
              <>
                <span className="border p-1">{el.name}</span>
                <span className="border p-1"> {onWorkMilitary.filter(obj => obj.city_id === el.id).length}</span>
                <span className="border p-1">{onWorkPeople.filter(obj => obj.city_id === el.id).length}</span>
              </>
            )
          })}
        </div>
        <p>
          <b>2. Число заболевших:</b><br/>
          Всего - <b>{withDisease.length}</b> <br/>
          в том числе:
        </p>
        <p className="font-bold text-center ">
          Не ОРВИ {withNoInfectionAmb.length + withNoInfectionStat.length} - чел
          . ({withNoInfectionAmb.filter(el => el.is_military).length + withNoInfectionAmb.filter(el => el.is_military).length} в/сл,
          {withNoInfectionAmb.filter(el => !el.is_military).length + withNoInfectionAmb.filter(el => !el.is_military).length})
        </p>
        <div className="grid grid-cols-5 mt-1 text-center">
          <span className="border p-1"> №</span>
          <span className="border p-1"> Подразделение</span>
          <span className="border p-1"> Воиское звание</span>
          <span className="border p-1"> Фамилия, иницалы</span>
          <span className="border p-1"> Диагноз</span>
          <p className="col-span-5 font-bold text-center border p-1">Стационар</p>
          {withNoInfectionStat.map((el, index) => {
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
          <p className="col-span-5 font-bold text-center border p-1">Амбулаторно</p>
          {withNoInfectionAmb.map((el, index) => {
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
        <p className="font-bold text-center mt-8">
          Острые респираторные вирусные инфекции (не коронавирусная инфекция) {withRespiratornoStat.length + withRespiratornoAmb.length} -  чел.
        </p>
        <div className="grid grid-cols-5 mt-1 text-center">
          <span className="border p-1"> №</span>
          <span className="border p-1"> Подразделение</span>
          <span className="border p-1"> Воиское звание</span>
          <span className="border p-1"> Фамилия, иницалы</span>
          <span className="border p-1"> Диагноз</span>
          <p className="col-span-5 font-bold text-center border p-1">Стационар</p>
          {withRespiratornoStat.map((el, index) => {
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
          <p className="col-span-5 font-bold text-center border p-1">Амбулаторно</p>
          {withRespiratornoAmb.map((el, index) => {
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
        <p className="text-center mt-8">
          <b>Число находящихся на карантине (изоляция):</b><br/>
          Всего - <b>{withKarantin.length}</b>, в том числе:<br/>
          военнослужащие - <b>{withKarantin.filter(el => el.is_military).length}</b> чел.;
          гр. персонал  - <b>{withKarantin.filter(el => !el.is_military).length}</b> чел.
        </p>
        <div className="grid grid-cols-5 mt-1 text-center">
          <span className="border p-1"> №</span>
          <span className="border p-1"> Подразделение</span>
          <span className="border p-1"> Воиское звание</span>
          <span className="border p-1"> Фамилия и иницалы</span>
          <span className="border p-1"> Причина</span>
          {withKarantin.map((el, index) => {
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
        <p className="font-bold text-center mt-8">
          Коронавирусная инфекция - {withCovidAmb.length + withCovidStat.length} чел.
        </p>
        <div className="grid grid-cols-5 mt-1 text-center">
          <span className="border p-1"> №</span>
          <span className="border p-1"> Подразделение</span>
          <span className="border p-1"> Воиское звание</span>
          <span className="border p-1"> Фамилия и иницалы</span>
          <span className="border p-1"> Причина</span>
          <p className="col-span-5 font-bold text-center border p-1">Стационар</p>
          {withCovidStat.map((el, index) => {
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
          <p className="col-span-5 font-bold text-center border p-1">Амбулаторно</p>
          {withCovidAmb.map((el, index) => {
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
      </div>
    </>
  )
}

export default SeeReport