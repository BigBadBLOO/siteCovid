import React, {createRef, useEffect, useState} from "react";
import Button, {InputForDatePicker} from "./Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import workWithServer from "../core/workWithServer";
import Moment from "react-moment";


function makeTableData(mass) {
  return (
    mass.length > 0
      ? mass.map((el, index) => {
        return (
          <div className="flex break-words">
            <p className="border p-1 inline-block" style={{width: "5%"}}>{index + 1}</p>
            <p className="border p-1 inline-block" style={{width: "12%"}}>{el.group_id__name}</p>
            <p className="border p-1 inline-block" style={{width: "13%"}}>{el.rank_id__name}</p>
            <p className="border p-1 inline-block w-3/12">{el.name}</p>
            <p className="border p-1 inline-block w-6/12"> {el.comment}</p>
          </div>
        )
      })
      : <p className="text-center border p-1"> Отсутствуют</p>
  )
}

function makeTableHeader() {
  return (
    <div className="flex break-words ">
      <p className="border p-1 inline-block" style={{width: "5%"}}> №</p>
      <p className="border p-1 inline-block" style={{width: "12%"}}> Подразделение</p>
      <p className="border p-1 inline-block" style={{width: "13%"}}> Воинское звание</p>
      <p className="border p-1 inline-block w-3/12"> Фамилия, инициалы</p>
      <p className="border p-1 inline-block w-6/12"> Комментарии</p>
    </div>
  )
}

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
  const onWorkPeople = onWorkAll.filter(el => el.is_military === false);
  const onWorkMilitaryWithChildren = onWorkMilitary.filter(el => el.is_woman_with_children);
  const onWorkPeopleWithChildren = onWorkPeople.filter(el => el.is_woman_with_children);

  let withDisease = listOfPerson.filter(el => !!el.status_id);

  const withNoInfectionAmb = withDisease.filter(el => el.status_id__name === 'Неинфекционное заболевание, амбулаторно');
  const withNoInfectionStat = withDisease.filter(el => el.status_id__name === 'Неинфекционное заболевание, стационарно');

  const withPnevmoniaAmb = withDisease.filter(el => el.status_id__name === 'Пневмония, амбулаторно');
  const withPnevmoniaStat = withDisease.filter(el => el.status_id__name === 'Пневмония, стационарно');

  const withRespiratornoAmb = withDisease.filter(el => el.status_id__name === 'Респираторное заболевание, амбулаторно');
  const withRespiratornoStat = withDisease.filter(el => el.status_id__name === 'Респираторное заболевание, стационарно');

  const withKarantin = withDisease.filter(el => el.status_id__name === 'Карантин');

  const withCovidAmb = withDisease.filter(el => el.status_id__name === 'Коронавирус, амбулаторно');
  const withCovidStat = withDisease.filter(el => el.status_id__name === 'Коронавирус, стационарно');

  withDisease = [...withNoInfectionAmb, ...withNoInfectionStat, ...withPnevmoniaAmb, ...withPnevmoniaStat,
    ...withRespiratornoAmb, ...withRespiratornoStat, ...withKarantin, ...withCovidAmb, ...withCovidStat];

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
        {/*<DatePicker*/}
        {/*  className="rounded border border-blue-700 p-1"*/}
        {/*  selected={startDate}*/}
        {/*  onChange={setStartDate}*/}
        {/*  dateFormat="dd.MM.yyyy"*/}
        {/*  customInput={<InputForDatePicker/>}*/}
        {/*/>*/}
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
        <div className="mt-1 text-center">
          <div className="flex">
            <p className="border p-1 inline-block w-1/3"> ППД</p>
            <p className="border p-1 inline-block w-1/3"> Военнослужащие</p>
            <p className="border p-1 inline-block w-1/3"> Гр. персонал</p>
          </div>
          {listOfCity.map(el => {
            return (
              <div className="flex">
                <span className="border p-1 inline-block w-1/3">{el.name}</span>
                <span
                  className="border p-1 inline-block w-1/3"> {onWorkMilitary.filter(obj => obj.city_id === el.id).length}</span>
                <span
                  className="border p-1 inline-block w-1/3">{onWorkPeople.filter(obj => obj.city_id === el.id).length}</span>
              </div>
            )
          })}
        </div>

        <p>
          <b>2. Число заболевших:</b><br/>
          Всего - <b>{withDisease.length}</b> <br/>
          в том числе:
        </p>
        <p className="font-bold text-center ">
          Не ОРВИ {withNoInfectionAmb.length + withNoInfectionStat.length} - чел.
          ({withNoInfectionAmb.filter(el => el.is_military).length + withNoInfectionStat.filter(el => el.is_military).length} в/сл,
          {withNoInfectionAmb.filter(el => !el.is_military).length + withNoInfectionStat.filter(el => !el.is_military).length} гп)
        </p>
        <div className="mt-1 text-center text-xs">
          {makeTableHeader()}
          <p className="font-bold text-center border p-1">Стационар</p>
          {makeTableData(withNoInfectionStat)}
          <p className="font-bold text-center border p-1">Амбулаторно</p>
          {makeTableData(withNoInfectionAmb)}
        </div>
        <p className="font-bold text-center mt-8">
          Пневмония {withPnevmoniaAmb.length + withPnevmoniaStat.length} - чел.
          ({withPnevmoniaAmb.filter(el => el.is_military).length + withPnevmoniaStat.filter(el => el.is_military).length} в/сл,
          {withPnevmoniaAmb.filter(el => !el.is_military).length + withPnevmoniaStat.filter(el => !el.is_military).length} гп)
        </p>
        <div className=" mt-1 text-center text-xs">
          {makeTableHeader()}
          <p className="font-bold text-center border p-1">Стационар</p>
          {makeTableData(withPnevmoniaStat)}
          <p className="font-bold text-center border p-1">Амбулаторно</p>
          {makeTableData(withPnevmoniaAmb)}
        </div>

        <p className="font-bold text-center mt-8">
          Острые респираторные вирусные инфекции (не коронавирусная
          инфекция) {withRespiratornoStat.length + withRespiratornoAmb.length} - чел.
          ({withRespiratornoStat.filter(el => el.is_military).length + withRespiratornoAmb.filter(el => el.is_military).length} в/сл,
          {withRespiratornoStat.filter(el => !el.is_military).length + withRespiratornoAmb.filter(el => !el.is_military).length} гп)
        </p>
        <div className="mt-1 text-center text-xs">
          {makeTableHeader()}
          <p className="font-bold text-center border p-1">Стационар</p>
          {makeTableData(withRespiratornoStat)}
          <p className="font-bold text-center border p-1">Амбулаторно</p>
          {makeTableData(withRespiratornoAmb)}
        </div>

        <p className="font-bold text-center mt-8">
          Число находящихся на карантине (изоляция) {withKarantin.length} - чел.
          ({withKarantin.filter(el => el.is_military).length} в/сл,
          {withKarantin.filter(el => !el.is_military).length} гп)
        </p>
        <div className="mt-1 text-center text-xs">
          {makeTableHeader()}
          {makeTableData(withKarantin)}
        </div>
        <p className="font-bold text-center mt-8">
          Коронавирусная инфекция - {withCovidAmb.length + withCovidStat.length} чел.
          ({withCovidAmb.filter(el => el.is_military).length + withCovidStat.filter(el => el.is_military).length} в/сл,
          {withCovidAmb.filter(el => !el.is_military).length + withCovidStat.filter(el => !el.is_military).length} гп)
        </p>
        <div className="mt-1 text-center text-xs">
          {makeTableHeader()}
          <p className="font-bold text-center border p-1">Стационар</p>
          {makeTableData(withCovidStat)}
          <p className="font-bold text-center border p-1">Амбулаторно</p>
          {makeTableData(withCovidAmb)}
        </div>
        <div className="mt-4 text-left">
          <p className="p-1">Офицер оперативной группы в/ч 51105</p>
          <Moment className=" p-1" format="DD.MM.YYYY">{startDate}</Moment>
          <p className="text-right p-1">_____________________________________________________________________</p>
          <p className="text-right p-1"><pre>воинское звание    подпись    инициал имени, фамилия</pre></p>
          <p className="p-1">Начальник ФГКУ "12 ЦНИИ" Минобороны России</p>
          <p className="text-right p-1">_____________________________________________________________________</p>
          <p className="text-right p-1"><pre>воинское звание    подпись    инициал имени, фамилия</pre></p>
        </div>
      </div>
    </>
  )
}

export default SeeReport