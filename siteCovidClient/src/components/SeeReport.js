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
            <p className="border p-1 inline-block w-6/12 text-left">
              {el.comment}
              {!!el.extraFields['t'] && <><br/>{'Температура: ' + el.extraFields['t']}</>}
              {(!!el.extraFields['test'] || !!el.extraFields['test_date']) && <>
                <br/>{'Тест на Covid: ' + el.extraFields['test'] + ' ' + el.extraFields['test_date']}</>}
              {(!!el.extraFields['test_result'] || !!el.extraFields['test_result_date']) && <>
                <br/>{'Результат теста на Covid: ' + el.extraFields['test_result'] + ' ' + el.extraFields['test_result_date']}</>}
            </p>
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

function repeatBlock(block, count) {
  const mass = [];
  let i = 0;
  while (i < count) {
    mass.push(block);
    i++
  }
  return <>
    {mass}
  </>
}

function filterBlock(mass) {
  return <>
    <td className="border p-1">{mass.filter(el => el.is_military).length}</td>
    <td className="border p-1">{mass.filter(el => !el.is_military).length}</td>
    <td className="border p-1">{mass.length}</td>
  </>
}

function SeeReport({setShowBody, headerRef}) {
  const [startDate, setStartDate] = useState(new Date());
  const printRef = createRef();

  const [listOfPerson, setListOfPerson] = useState([]);
  const [listOfCity, setListOfCity] = useState([]);
  const [listOfGroup, setListOfGroup] = useState([]);
  const getListOfReport = () => {
    workWithServer.getListOfReport({'date': startDate, 'includeExtraFields': true}).then(data => {
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
    workWithServer.getListOfGroup().then(setListOfGroup)
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

  const onRemoteWork = withDisease.filter(el => el.status_id__name === 'Удаленная работа');


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
        <div className="float-right" style={{marginLeft: '100%'}}>
          <p className="text-center p-1">Начальник ФГКУ "12 ЦНИИ"<br/> Минобороны России</p>
          <p className="text-right p-1">_________________________________</p>
        </div>
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
        <div className="mt-1 text-center text-xs break-words">
          <div className="flex">
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>ППД</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>Военнослужащие</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>Гр. персонал</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>Covid</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>ОРВ</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>Другое<br/>заболевание</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>Самоизоляция<br/>Карантин</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>Удаленная работа</p>
          </div>
          {listOfCity.map(el => {
            return (
              <div className="flex">
                <span className="border p-1 inline-block" style={{width: '12.5%'}}>{el.name}</span>
                <span className="border p-1 inline-block" style={{width: '12.5%'}}>
                  {onWorkMilitary.filter(obj => obj.city_id === el.id).length}
                </span>
                <span className="border p-1 inline-block" style={{width: '12.5%'}}>
                  {onWorkPeople.filter(obj => obj.city_id === el.id).length}
                </span>
                <span className="border p-1 inline-block" style={{width: '12.5%'}}>
                  {withCovidStat.filter(obj => obj.city_id === el.id).length + withCovidAmb.filter(obj => obj.city_id === el.id).length +
                  withPnevmoniaAmb.filter(obj => obj.city_id === el.id).length + withPnevmoniaStat.filter(obj => obj.city_id === el.id).length}
                </span>
                <span className="border p-1 inline-block" style={{width: '12.5%'}}>
                  {withRespiratornoAmb.filter(obj => obj.city_id === el.id).length + withRespiratornoStat.filter(obj => obj.city_id === el.id).length}
                </span>
                <span className="border p-1 inline-block" style={{width: '12.5%'}}>
                  {withNoInfectionAmb.filter(obj => obj.city_id === el.id).length + withNoInfectionStat.filter(obj => obj.city_id === el.id).length}
                </span>
                <span className="border p-1 inline-block" style={{width: '12.5%'}}>
                  {withKarantin.filter(obj => obj.city_id === el.id).length}
                </span>
                <span className="border p-1 inline-block" style={{width: '12.5%'}}>
                  {onRemoteWork.filter(obj => obj.city_id === el.id).length}
                </span>
              </div>
            )
          })}
          <div className="flex">
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>Итого</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>{onWorkMilitary.length}</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>{onWorkPeople.length}</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>
              {withCovidStat.length + withCovidAmb.length + withPnevmoniaAmb.length + withPnevmoniaStat.length}
            </p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>
              {withRespiratornoAmb.length + withRespiratornoStat.length}
            </p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>
              {withNoInfectionAmb.length + withNoInfectionStat.length}
            </p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>{withKarantin.length}</p>
            <p className="border p-1 inline-block" style={{width: '12.5%'}}>{onRemoteWork.length}</p>
          </div>
        </div>

        <p className="mt-2">
          <b>2. Число заболевших:</b>
        </p>

        <table className="mt-1 text-center text-xs break-words w-full">
          <tr>
            <td rowSpan={2} className="border p-1 w-1/6">Подразделения</td>
            <td colSpan={3} className="border p-1 w-1/6">Covid</td>
            <td colSpan={3} className="border p-1 w-1/6">ОРВ</td>
            <td colSpan={3} className="border p-1 w-1/6">Другое заболевание</td>
            <td colSpan={3} className="border p-1 w-1/6">Самоизоляция карантин</td>
            <td colSpan={3} className="border p-1 w-1/6">Удаленная работа</td>
          </tr>
          <tr>
            {repeatBlock(<>
              <td className="border p-1">Всл.</td>
              <td className="border p-1">ГП</td>
              <td className="border p-1">Итого</td>
            </>, 5)}
          </tr>
          {listOfGroup.map(el => {
            const withCovid = [...withCovidAmb.filter(person => person.group_id__name === el.name),
              ...withCovidStat.filter(person => person.group_id__name === el.name)];
            const withOrv = [...withRespiratornoAmb.filter(person => person.group_id__name === el.name),
              ...withRespiratornoStat.filter(person => person.group_id__name === el.name),
              ...withPnevmoniaAmb.filter(person => person.group_id__name === el.name),
              ...withPnevmoniaStat.filter(person => person.group_id__name === el.name)];
            const withOther = [...withNoInfectionAmb.filter(person => person.group_id__name === el.name),
              ...withNoInfectionStat.filter(person => person.group_id__name === el.name)];
            const karantin = [...withKarantin.filter(person => person.group_id__name === el.name)];
            const remoteWork = [...onRemoteWork.filter(person => person.group_id__name === el.name)];
            return (
              <tr>
                <td className="border p-1">{el.name}</td>
                {filterBlock(withCovid)}
                {filterBlock(withOrv)}
                {filterBlock(withOther)}
                {filterBlock(karantin)}
                {filterBlock(remoteWork)}
              </tr>
            )
          })}
          <tr>
            <td className="border p-1">Итого</td>
            {filterBlock([...withCovidAmb,...withCovidStat])}
            {filterBlock([...withRespiratornoAmb,...withRespiratornoStat,
              ...withPnevmoniaAmb, ...withPnevmoniaStat])}
            {filterBlock([...withNoInfectionAmb,...withNoInfectionStat])}
            {filterBlock(withKarantin)}
            {filterBlock(onRemoteWork)}
          </tr>
        </table>

        <p className="mt-2">
          Всего - <b>{withDisease.length}</b> <br/>
          в том числе:
        </p>
        <p className="font-bold text-center ">
          Не ОРВИ - {withNoInfectionAmb.length + withNoInfectionStat.length} чел.
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
          Пневмония - {withPnevmoniaAmb.length + withPnevmoniaStat.length} чел.
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
          инфекция) - {withRespiratornoStat.length + withRespiratornoAmb.length} чел.
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
          Число находящихся на карантине (изоляция) - {withKarantin.length} чел.
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
          <p className="text-right p-1">
            <pre>воинское звание    подпись    инициал имени, фамилия</pre>
          </p>
        </div>
      </div>
    </>
  )
}

export default SeeReport