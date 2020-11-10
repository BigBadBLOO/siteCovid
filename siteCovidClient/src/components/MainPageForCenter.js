import React, {useEffect, useState} from 'react'
import Button, {InputForDatePicker} from "./Button";
import workWithServer from "../core/workWithServer";
import Moment from "react-moment";
import MyModal from "./Modal";
import clsx from "clsx";
import DatePicker from "react-datepicker";
import moment from "moment";

export default function MainPageForCenter({setShowBody}) {
  const curr = new Date();
  const firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1, 5);
  const lastDay = new Date(curr.getFullYear(), curr.getMonth() + 1, 0, 5);

  const [currDate, setCurrDate] = useState(curr);
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);
  const [massWithDate, setMassWithDate] = useState([]);
  const [endDateForModal, setEndDateForModal] = useState(null);

  const [listOfPerson, setListOfPerson] = useState([]);
  const [listOfReport, setListOfReport] = useState([]);
  const [listStatus, setListStatus] = useState([]);

  const [show, setShow] = useState(false);
  const [personModal, setPersonModal] = useState({});
  const [objectModal, setObjectModal] = useState({});

  const [extraStatus, setExtraStatus] = useState([]);
  const [extraFields, setExtraFields] = useState({});
  const [showExtraFields, setShowExtraFields] = useState(false);
  const [showError, setShowError] = useState(false);

  const workWithExtraFields = status => setShowExtraFields(status ? status.with_extraField : false);

  const workWithStatus = (el, extrafields) => {
    setShowError(false);
    const status = listStatus.find(status => status.id === el.status_id);
    const children_status = status ? listStatus.filter(el => el.parent_id === status.id) : [];
    workWithExtraFields(children_status.length > 0 ? children_status[0] : status);
    setExtraStatus(children_status);

    if (status && status.parent_id) {
      el.extra_status_id = el.status_id;
      el.status_id = status.parent_id;
      setExtraStatus(listStatus.filter(el => el.parent_id === status.parent_id));
      status.with_extraField && Object.keys(extrafields).length === 0 && setExtraFields({
        't': ''
      })
        // : setExtraFields({});
    } else if (children_status.length > 0) {
      el.extra_status_id = children_status[0].id;
      el.status_id = status.id;
      children_status[0].with_extraField && Object.keys(extrafields).length === 0 && setExtraFields({
        't': ''
      })
    // : setExtraFields({});
    } else {
      // setExtraFields({});
      el.extra_status_id = null
    }
    return el
  };

  const modal = (person, obj, date) => {
    setPersonModal(person);
    let el = obj ? {...obj} : {
      'userForControl_id': person.id,
      'date': date
    };
    workWithServer.getExtraFieldsForStatus({'day_data_id': el.id}).then((data) => {
      setExtraFields(data);
      el = workWithStatus(el, data);
      setObjectModal(el);
      setShowError(false);
      setShow(true);
    });
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
  console.log(extraFields);
  console.log(objectModal);
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
        <select className="rounded border border-blue-700 p-1 bg-white" value={currDate.getMonth()} onChange={e => {
          const curr = new Date();
          curr.setMonth(e.target.value);
          setCurrDate(curr);
          setStartDate(new Date(curr.getFullYear(), curr.getMonth(), 1, 5));
          setEndDate(new Date(curr.getFullYear(), curr.getMonth() + 1, 0, 5));
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
          <option value={11}>Декабрь</option>
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
                const filter = listReportByPerson.find(obj => Number(obj.date) === date.getDate() && !!obj.status_id);
                return <td className={clsx("p-1 border w-12 text-center align-middle text-red-500 cursor-pointer", {
                  'bg-blue-200 bg-opacity-25': date.getDay() === 0 || date.getDay() === 6,
                  'bg-red-200 bg-opacity-25': date.getDate() === curr.getDate(),
                })} onClick={() => {
                  modal(el, filter, date.getDate())
                }}>
                  {filter ? filter['status_id__abbr'] ? filter['status_id__abbr'] : '+' : ''}
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

        <p className="my-2">Выберите статус:</p>
        <select className="w-full h-full border-b border-blue-700 bg-white" value={objectModal.status_id}
                onChange={(e) => {
                  const value = e.target.value;
                  let comment = value ? objectModal.comment : '';
                  const el = workWithStatus({...objectModal, status_id: Number(value), comment: comment}, extraFields);
                  setObjectModal(el)
                }}>
          <option value="">Сбросить статус</option>
          {listStatus.filter(el => !el.parent_id).map(el => <option key={el.id} value={el.id} onClick={(obj) => {
            setExtraStatus(listStatus.filter(el => el.parent_id === obj.id))
          }}>{el.name}</option>)}
        </select>
        {extraStatus.length > 0 && <>
          <p className="my-2">Выберите доп статус:</p>
          <select className="w-full h-full border-b border-blue-700 bg-white" value={objectModal.extra_status_id}
                  onChange={(e) => {
                    const value = e.target.value;
                    const el = workWithStatus({...objectModal, status_id: Number(value)}, extraFields);
                    setObjectModal(el)
                  }}>
            {extraStatus.map(el => <option key={el.id} value={el.id}>{el.name}</option>)}
          </select>
        </>}

        {showExtraFields && <>
          <p className="my-2">Температура тела</p>
          <input className="p-1 w-full border border-blue-700 bg-white rounded outline-none" value={extraFields.t}
                 placeholder="Температура тела..." onKeyPress={(event) => {
            if ((event.which != 46) && (event.which < 48 || event.which > 57)) {
              event.preventDefault();
            }
          }} onChange={(e) => {
            setShowError(false);
            setExtraFields({...extraFields, t: e.target.value})
          }}/>
        </>}

        <p className="my-2">По какое число:</p>
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
        {showExtraFields && !!(listStatus.find(el => el.id === objectModal.extra_status_id && el.name.toLowerCase().indexOf('неинфекционное'))) && <>
          <p className="my-2">Тест на Covid</p>
          <div className="flex">
            <DatePicker
              className="rounded border border-blue-700 p-1 w-full"
              selected={extraFields.test_date ? moment(extraFields.test_date, "DD.MM.YYYY").toDate() : null}
              onChange={date => {
                setExtraFields({...extraFields, test_date: date ? date.toLocaleDateString('ru') : ''})
              }}
              dateFormat="dd.MM.yyyy"
              customInput={<InputForDatePicker/>}
              isClearable
              placeholderText="Дата теста..."
            />
            <input className="w-full p-1 border border-blue-700 bg-white rounded outline-none"
                   value={extraFields.test} placeholder="Комментарий..." onChange={(e) => {
              setShowError(false);
              setExtraFields({...extraFields, test: e.target.value})
            }}/>
          </div>

          <p className="my-2">Тест на Covid результат</p>
          <div className="flex">
            <DatePicker
              className="rounded border border-blue-700 p-1 w-full"
              selected={extraFields.test_result_date ? moment(extraFields.test_result_date, "DD.MM.YYYY").toDate() : null}
              onChange={date => {
                setExtraFields({...extraFields, test_result_date: date ? date.toLocaleDateString('ru') : ''})
              }}
              dateFormat="dd.MM.yyyy"
              customInput={<InputForDatePicker/>}
              isClearable
              placeholderText="Дата результата теста..."
            />
            <input className="w-full p-1 border border-blue-700 bg-white rounded outline-none"
                   value={extraFields.test_result} placeholder="Результат теста на Covid..." onChange={(e) => {
              setShowError(false);
              setExtraFields({...extraFields, test_result: e.target.value})
            }}/>
          </div>


        </>}
        {showError && <p className="text-red-500 text-center">Вам необходимо заполнить все поля</p>}
        <p className="my-2">Комментарий</p>
        <textarea className="p-1 w-full border border-blue-700 bg-white rounded outline-none"
                  value={objectModal.comment}
                  placeholder="Оставьте комментарий..." onChange={(e) => {
          setObjectModal({...objectModal, comment: e.target.value})
        }}/>

        <Button className="my-4 mx-0 w-full" type="primary" text="Сохранить" onClick={() => {
          if (('t' in extraFields && !extraFields.t) ||
            ((!!extraFields.test_date) && ('test_date' in extraFields && !extraFields.test_result_date)) ||
            (!('fromDiseaseDate' in extraFields) && objectModal.extra_status_id && !endDateForModal)
          ) {
            setShowError(true);
            return
          }
          const month = currDate.getMonth() + 1 >= 10 ? currDate.getMonth() + 1 : '0' + (currDate.getMonth() + 1);
          const day = (String(objectModal.date)).length >= 2 ? objectModal.date : '0' + objectModal.date;
          objectModal.status_id = objectModal.extra_status_id ? objectModal.extra_status_id : objectModal.status_id;
          workWithServer.setOneReport({
            'data': objectModal,
            'date': `${currDate.getFullYear()}-${month}-${day}`,
            'date_end': endDateForModal,
            'extraFields': extraFields
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