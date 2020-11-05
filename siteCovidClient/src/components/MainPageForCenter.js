import React, {useEffect, useState} from 'react'
import Button, {InputForDatePicker} from "./Button";
import workWithServer from "../core/workWithServer";
import Moment from "react-moment";
import MyModal from "./Modal";
import clsx from "clsx";
import DatePicker from "react-datepicker";

export default function MainPageForCenter({setShowBody}) {
  const curr = new Date();
  const [currDate, setCurrDate] = useState(curr);

  const firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1, 5);
  const lastDay = new Date(curr.getFullYear(), curr.getMonth() + 1, 0, 5);

  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);

  const [endDateForModal, setEndDateForModal] = useState(null);

  const [month, setMonth] = useState(currDate.getMonth());

  const [massWithDate, setMassWithDate] = useState([]);

  const [listOfPerson, setListOfPerson] = useState([]);
  const [listOfReport, setListOfReport] = useState([]);
  const [listStatus, setListStatus] = useState([]);

  const [show, setShow] = useState(false);
  const [personModal, setPersonModal] = useState({});
  const [objectModal, setObjectModal] = useState({});

  const [showError, setShowError] = useState(false);

  const modal = (person, obj, date) => {
    setPersonModal(person);
    setObjectModal(obj.length > 0 ? obj[0] : {
      'userForControl_id': person.id,
      'date': date
    });
    setShow(true);
  };

  useEffect(() => {
    workWithServer.getListOfPerson().then(setListOfPerson);
    workWithServer.getListOfStatus().then(setListStatus);
  }, []);

  useEffect(() => {
    workWithServer.getListOfReport({'date_begin': startDate, 'date_end': endDate}).then(data => {
      setListOfReport(data)
    });
    const tempMassWithDate = [];
    const currentDate = new Date(startDate);
    while (endDate >= currentDate) {
      tempMassWithDate.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1)
    }
    setMassWithDate(tempMassWithDate)
  }, [startDate, endDate]);
  return (
    <div>
      <div>
        {/*<Button className="" type='primary' text="Управление должностями" onClick={() => {*/}
        {/*  setShowBody('listOfPost')*/}
        {/*}}/>*/}
        <Button className="" type='primary' text="Управление л/с" onClick={() => {
          setShowBody('listOfPerson')
        }}/>
        {/*<Button className="" type='primary' text="Сформировать отчет" onClick={() => {*/}
        {/*  setShowBody('makeReport')*/}
        {/*}}/>*/}
        <select className="rounded border border-blue-700 p-1 bg-white" value={month} onChange={e => {
          const curr = new Date();
          curr.setMonth(e.target.value);
          setCurrDate(curr);
          setStartDate(new Date(curr.getFullYear(), curr.getMonth(), 1, 5));
          setEndDate(new Date(curr.getFullYear(), curr.getMonth() + 1, 0, 5));
          setMonth(e.target.value)
        }
        }>
          <option value={0}>Январь</option>
          <option value={1}>Февраль</option>
          <option value={2}>Март</option>
          <option value={3}>Апрель</option>
          <option value={4}>Май</option>
          <option value={5}>Июнь</option>
          <option value={6}>Июль</option>
          <option value={7}>Август</option>
          <option value={8}>Сентябрь</option>
          <option value={9}>Октябрь</option>
          <option value={10}>Ноябрь</option>
          <option value={11}>декабрь</option>
        </select>
        <div className="float-right">
          <Button className="" type='warning' text="Списки на проход" onClick={() => {
            setShowBody('listForEntering')
          }}/>
          <Button className="" type='warning' text="Справка доклад" onClick={() => {
            setShowBody('report')
          }}/>
        </div>
      </div>
      <div>
        <table className="m-2 overflow-x-auto">
          <tr className="">
            <td className="w-12 p-1 border">№</td>
            <td className="w-40 p-1 border">Звание</td>
            <td className="w-56 p-1 border">ФИО</td>
            {massWithDate.map(el => <td className={clsx("p-1 border", {
              'bg-blue-200 bg-opacity-25': el.getDay() === 0 || el.getDay() === 6,
              'bg-red-200 bg-opacity-25': el.getDate() === curr.getDate(),
            })}>
              <Moment format="DD">{el}</Moment></td>)}
          </tr>
          {listOfPerson.map((el, index) => {
            const listReportByPerson = listOfReport.filter(obj => obj.userForControl_id === el.id);
            return <tr className="">
              <td className="w-12 p-1 border">{index + 1}</td>
              <td className="w-40 p-1 border">{el.rank_id__name}</td>
              <td className="w-56  p-1 border cursor-pointer">{el.name}</td>
              {massWithDate.map(date => {
                const filter = listReportByPerson.filter(obj => Number(obj.date) === date.getDate() && !!obj.status_id);
                return <td className={clsx("p-1 border w-12 text-center align-middle text-red-500 cursor-pointer", {
                  'bg-blue-200 bg-opacity-25': date.getDay() === 0 || date.getDay() === 6,
                  'bg-red-200 bg-opacity-25': date.getDate() === curr.getDate(),
                })} onClick={() => {
                  setShowError(false);
                  modal(el, filter, date.getDate())
                }}>
                  {filter.length > 0 ? filter[0]['status_id__abbr'] ? filter[0]['status_id__abbr'] : '+' : ''}
                </td>
              })}
            </tr>
          })}
        </table>
      </div>
      <MyModal show={show} showModal={setShow}>
        <div className="border-b m-1 mb-4 p-2 flex">
          <span
            className="my-auto">{personModal.name} ({objectModal.date}.{currDate.getMonth() + 1}.{currDate.getFullYear()})</span>
          <span className="ml-auto cursor-pointer" onClick={() => setShow(false)}>x</span>
        </div>

        <label>Выберите статус:</label>
        <select className="my-4 w-full h-full border-b border-blue-700 bg-white" value={objectModal.status_id}
                onChange={(e) => {
                  let comment = e.target.value ? objectModal.comment : '';
                  setObjectModal({...objectModal, status_id: Number(e.target.value), comment: comment})
                }}>
          <option key={-1} value="">Сбросить статус</option>
          {listStatus.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
        </select>
        <label>Комментарий</label>
        <textarea className="my-4 p-1 w-full border border-blue-700 bg-white rounded outline-none"
                  value={objectModal.comment}
                  placeholder="Оставьте комментарий..." onChange={(e) => {
          setShowError(false);
          setObjectModal({...objectModal, comment: e.target.value})
        }}/>
        {showError && <p className="text-red-500 text-center">Вам необходимо заполнить комментарий</p>}
        <p className="">По какое число:</p>
        <DatePicker
          className="rounded border border-blue-700 p-1 w-full"
          selected={endDateForModal}
          onChange={date => setEndDateForModal(new Date(date.setHours(5)))}
          dateFormat="dd.MM.yyyy"
          customInput={<InputForDatePicker/>}
          isClearable
          placeholderText="По какое число..."
          minDate={new Date(currDate.getFullYear(), currDate.getMonth(), objectModal.date)}
        />
        <Button className="my-4 mx-0 w-full" type="primary" text="Сохранить" onClick={() => {
          if (objectModal.status_id) {
            let status = listStatus.filter(el => el.id === objectModal.status_id);
            status = status.length > 0 ? status[0] : {};
            if (status.is_required && !objectModal.comment) {
              setShowError(true);
              return;
            }
          }
          const month = currDate.getMonth() + 1 >= 10 ? currDate.getMonth() + 1 : '0' + (currDate.getMonth() + 1);
          const day = objectModal.date.length >= 2 ? objectModal.date : '0' + objectModal.date;
          workWithServer.setOneReport({
            'data': objectModal,
            'date': `${currDate.getFullYear()}-${month}-${day}`,
            'date_end': endDateForModal
          }).then(() => {
            workWithServer.getListOfReport({'date_begin': startDate, 'date_end': endDate}).then(data => {
              setListOfReport(data)
            });
          });
          setShow(false);
          setEndDateForModal(null);
        }}/>

      </MyModal>
    </div>
  )
}