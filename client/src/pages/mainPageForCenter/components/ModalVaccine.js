//core
import React, {useEffect, useState} from 'react'
import clsx from "clsx";
import DatePicker from "react-datepicker";
import {registerLocale} from "react-datepicker";
import ru from "date-fns/locale/ru";

//components
import MyModal from "../../../components/modal/Modal";
import Button, {InputForDatePicker} from "../../../components/Button";

//functions
import workWithServer from "../../../core/workWithServer";

import {from_date_format} from "../../../core/localWorkWithDate";
import {getLast, getVaccineStatus} from "../../../core/localWorkWithList";

registerLocale("ru", ru);

function VaccineBLock({vaccine, num, edit,setObjectVaccineModal, setListOfVaccine}) {
  const [editable, setEditable] = useState(!!vaccine.initEditable);
  const [bufVac, setBufVac] = useState(vaccine);

  return bufVac !== null &&
      <div className="border m-2 p-2">
        {
          editable && <div className="flex p-1">
            <p className="my-2 mr-2 w-48">1 компонентный</p>
            <input
                type="checkbox"
                checked={bufVac.countComponent === 1}
                onChange={(e) => {
                  const oldCountComponent = bufVac.countComponent === 1;
                  setBufVac({
                    ...bufVac,
                    countComponent: oldCountComponent ? 2 : 1,
                    second_date: (oldCountComponent ? bufVac.second_date : null)
                  })
                }}
            />
          </div>
        }
        <div className="">
          <div className="flex p-1">
            <p className="my-2 mr-2 w-48">Дата первой вакцинации</p>
            {
              editable
                  ? <DatePicker
                      className="rounded border "
                      selected={
                        bufVac.first_date
                            ? new Date(bufVac.first_date)
                            : null
                      }
                      onChange={date => {
                        setBufVac({...bufVac, first_date: (date && new Date(date.setHours(5)))})
                      }}
                      maxDate={
                        bufVac.second_date
                            ? new Date(bufVac.second_date)
                            : null
                      }
                      dateFormat="dd.MM.yyyy"
                      customInput={<InputForDatePicker
                          className="ml-auto w-32 border border-blue-700 bg-white rounded outline-none"/>}
                      isClearable
                      showWeekNumbers
                      locale="ru"
                      placeholderText="Дата..."
                  />
                  : <p className="p-1 ml-auto text-center w-32 border border-blue-700 bg-white rounded outline-none">
                    {from_date_format(new Date(bufVac.first_date))}
                  </p>
            }
          </div>
          {
            bufVac.countComponent === 2 && <div className="flex p-1">
              <p className="my-2 mr-2 w-48">Дата второй вакцинации</p>
              {
                editable
                    ? <DatePicker
                        className="rounded border "
                        selected={
                          bufVac.second_date
                              ? new Date(bufVac.second_date)
                              : null
                        }
                        minDate={
                          bufVac.first_date
                              ? new Date(bufVac.first_date)
                              : null
                        }
                        onChange={date => {
                          console.log(date && new Date(date.setHours(5)));
                          setBufVac({...bufVac, second_date: (date && new Date(date.setHours(5)))})
                        }}
                        dateFormat="dd.MM.yyyy"
                        customInput={<InputForDatePicker
                            className="ml-auto w-32 border border-blue-700 bg-white rounded outline-none"/>}
                        isClearable
                        showWeekNumbers
                        locale="ru"
                        placeholderText="Дата..."
                    />
                    : <p className="p-1 ml-auto text-center w-32 border border-blue-700 bg-white rounded outline-none">
                      {bufVac.second_date ? from_date_format(new Date(bufVac.second_date)) : 'Отсутствует'}
                    </p>
              }
            </div>
          }
        </div>
        {
          editable
              ? <textarea
                  className="p-1 w-full border bg-white rounded outline-none"
                  value={bufVac.comment}
                  placeholder="Оставьте комментарий..."
                  onChange={e => {
                    setBufVac({...bufVac, comment: e.target.value})
                  }}
              />
              : <p className="text-center border">{bufVac.comment}</p>
        }

        {
          edit && <div className="flex">
            {
              !editable && <Button
                  type="warning"
                  text="Редактировать"
                  className="w-full"
                  onClick={() => {
                    setEditable(true);
                  }}
              />
            }
            {
              !editable && <Button
                  type="danger"
                  text="Удалить"
                  className="w-full"
                  onClick={() => {
                    const data = {...bufVac, remove: true};
                    workWithServer.setOneVaccine({data}).then((res) => {
                      setListOfVaccine(res.vaccine);
                      setObjectVaccineModal(prev => {
                        return {
                          ...prev, vaccineList: prev.vaccineList.filter(el => el.id !== bufVac.id)
                        }
                      })
                    })
                  }}
              />
            }
            {
              editable && <Button
                  type="success"
                  text="Сохранить"
                  className="w-full"
                  onClick={() => {
                    setEditable(false);
                    workWithServer.setOneVaccine({data: bufVac}).then((res) => {
                      setListOfVaccine(res.vaccine);
                      setObjectVaccineModal(prev => {
                        const vaccineList = res.vaccine.filter(el => el.userForControl_id === bufVac.userForControl_id);
                        return {
                          ...prev, vaccineList
                        }
                      })
                    })
                  }}
              />
            }
            {
              editable && <Button
                  type="warning"
                  text="Отмена"
                  className="w-full"
                  onClick={() => {
                    setBufVac(!!bufVac.id ? bufVac : null);
                    setEditable(false);
                  }}
              />
            }
          </div>
        }
      </div>
}

export default function ModalVaccine({vaccine}) {
  const listVaccine = vaccine.objectVaccineModal.vaccineList;
  const vaccineStatus = getVaccineStatus(getLast(listVaccine));
  const [adding, setAdding] = useState(false);

  return (

      <MyModal show={vaccine.showVaccine} showModal={vaccine.setShowVaccine}>
        <div className="border-b m-1 mb-4 p-2 flex">
            <span className="my-auto">
                Вакцина:&nbsp;
              {
                vaccineStatus === null
                    ? 'Отсутствует'
                    : !!vaccineStatus
                    ? 'Активна' : 'Требуется ревакцинация'
              }
            </span>
        </div>
        {
          listVaccine && listVaccine.map((el, idx) => {
            return <VaccineBLock
                key={el.id}
                vaccine={el}
                num={idx + 1}
                edit={vaccine.objectVaccineModal.editModal}
                adding={adding}
                setListOfVaccine={vaccine.setListOfVaccine}
                setObjectVaccineModal={vaccine.setObjectVaccineModal}
                setAdding={setAdding}
            />
          })
        }
        {
          vaccine.objectVaccineModal.editModal && <div className="flex">
            <Button
                className="mx-auto"
                type="success"
                text="Добавить"
                onClick={() => {
                  setAdding(true);
                  vaccine.setObjectVaccineModal(prev => {
                    return {
                      ...prev, vaccineList: [...prev.vaccineList, {
                        userForControl_id: vaccine.objectVaccineModal.userForControl_id,
                        countComponent: 2,
                        comment: '',
                        initEditable: true,
                        first_date: new Date()
                      }]
                    }
                  })
                }}
            />
          </div>
        }

        {/*{vaccine.objectVaccineModal.editModal*/}
        {/*?*/}
        {/*<>*/}
        {/*<p className="my-2">Дата первой вакцинации:</p>*/}
        {/*<DatePicker*/}
        {/*className={*/}
        {/*clsx("w-full rounded border ", {*/}
        {/*'border-red-700 text-red-900': vaccine.vaccineError.indexOf('first_date') !== -1,*/}
        {/*'border-blue-700': vaccine.vaccineError.indexOf('first_date') === -1,*/}
        {/*})*/}
        {/*}*/}
        {/*selected={*/}
        {/*!!vaccine.objectVaccineModal.first_date*/}
        {/*? new Date(vaccine.objectVaccineModal.first_date)*/}
        {/*: null*/}
        {/*}*/}
        {/*onChange={*/}
        {/*date => {*/}
        {/*vaccine.setObjectVaccineModal({*/}
        {/*...vaccine.objectVaccineModal,*/}
        {/*first_date: (date && new Date(date.setHours(5)))*/}
        {/*});*/}

        {/*vaccine.setVaccineError([...vaccine.vaccineError.filter(el => el !== 'first_date')]);*/}
        {/*}*/}
        {/*}*/}
        {/*dateFormat="dd.MM.yyyy"*/}
        {/*customInput={<InputForDatePicker/>}*/}
        {/*isClearable*/}
        {/*showWeekNumbers*/}
        {/*locale="ru"*/}
        {/*placeholderText="Дата..."*/}
        {/*/>*/}
        {/*</>*/}
        {/*:*/}
        {/*<>*/}
        {/*{*/}
        {/*vaccine.objectVaccineModal.first_date && <>*/}
        {/*<p className="my-2">Дата первой вакцинации:</p>*/}
        {/*<p className="p-1 w-full border border-blue-700 bg-white rounded outline-none">*/}
        {/*{from_date_format(new Date(vaccine.objectVaccineModal.first_date))}*/}
        {/*</p>*/}
        {/*</>*/}
        {/*}*/}
        {/*</>}*/}
        {/*{*/}
        {/*vaccine.objectVaccineModal.editModal*/}
        {/*? <>*/}
        {/*<p className="my-2">Дата повторной вакцинации:</p>*/}
        {/*<DatePicker*/}
        {/*className={clsx("w-full rounded border border-blue-700", {})}*/}
        {/*selected={!!vaccine.objectVaccineModal.second_date*/}
        {/*? new Date(vaccine.objectVaccineModal.second_date)*/}
        {/*: null*/}
        {/*}*/}
        {/*onChange={*/}
        {/*date => {*/}
        {/*vaccine.setObjectVaccineModal({*/}
        {/*...vaccine.objectVaccineModal,*/}
        {/*second_date: (date && new Date(date.setHours(5)))*/}
        {/*})*/}
        {/*}*/}
        {/*}*/}
        {/*dateFormat="dd.MM.yyyy"*/}
        {/*customInput={<InputForDatePicker/>}*/}
        {/*isClearable*/}
        {/*showWeekNumbers*/}
        {/*locale="ru"*/}
        {/*placeholderText="Дата..."*/}
        {/*minDate={!!vaccine.objectVaccineModal.first_date*/}
        {/*? new Date(vaccine.objectVaccineModal.first_date)*/}
        {/*: null*/}
        {/*}*/}
        {/*/>*/}
        {/*</>*/}
        {/*: <>*/}
        {/*{*/}
        {/*vaccine.objectVaccineModal.second_date && <>*/}
        {/*<p className="my-2">Дата повторной вакцинации:</p>*/}
        {/*<p className="p-1 w-full border border-blue-700 bg-white rounded outline-none">*/}
        {/*{from_date_format(new Date(vaccine.objectVaccineModal.second_date))}*/}
        {/*</p>*/}
        {/*</>*/}
        {/*}*/}
        {/*</>*/}
        {/*}*/}
        {/*{vaccine.objectVaccineModal.editModal*/}
        {/*? <>*/}
        {/*<p className="my-2">Комментарий:</p>*/}
        {/*<textarea*/}
        {/*className={clsx("p-1 w-full border bg-white rounded outline-none", {*/}
        {/*'border-red-700 text-red-900 text-red-900': vaccine.vaccineError.indexOf('comment') !== -1,*/}
        {/*'border-blue-700': vaccine.vaccineError.indexOf('comment') === -1,*/}
        {/*})}*/}
        {/*value={vaccine.objectVaccineModal.comment}*/}
        {/*placeholder="Оставьте комментарий..." onChange={(e) => {*/}
        {/*vaccine.setVaccineError([...vaccine.vaccineError.filter(el => el !== 'comment')]);*/}
        {/*vaccine.setObjectVaccineModal({...vaccine.objectVaccineModal, comment: e.target.value})*/}
        {/*}}/>*/}
        {/*</>*/}
        {/*: <>*/}
        {/*{*/}
        {/*vaccine.objectVaccineModal.comment && <>*/}
        {/*<p className="my-2">Комментарий:</p>*/}
        {/*<p className="p-1 w-full border border-blue-700 bg-white rounded outline-none">*/}
        {/*{vaccine.objectVaccineModal.comment}*/}
        {/*</p>*/}
        {/*</>*/}
        {/*}*/}
        {/*</>}*/}
        {/*{*/}
        {/*vaccine.vaccineError.length !== 0*/}
        {/*&& <p className="text-red-500 text-center">Вам необходимо корректно заполнить указанные поля</p>*/}
        {/*}*/}
        {/*{*/}
        {/*vaccine.objectVaccineModal.editModal*/}
        {/*&& <div className="flex">*/}
        {/*<div*/}
        {/*className={clsx("", {*/}
        {/*'w-1/2 mr-1': !!vaccine.objectVaccineModal.id,*/}
        {/*'w-full': !vaccine.objectVaccineModal.id,*/}
        {/*})}*/}
        {/*>*/}
        {/*<Button*/}
        {/*className="my-4 mx-0 w-full text-center"*/}
        {/*type="success"*/}
        {/*text="Сохранить"*/}
        {/*onClick={() => {*/}
        {/*let error_list = [];*/}
        {/*if (!vaccine.objectVaccineModal.first_date) {*/}
        {/*error_list.push('first_date')*/}
        {/*}*/}
        {/*if (!vaccine.objectVaccineModal.comment) {*/}
        {/*error_list.push('comment')*/}
        {/*} else if (vaccine.objectVaccineModal.comment.trim().length === 0) {*/}
        {/*error_list.push('comment')*/}
        {/*}*/}
        {/*if (error_list.length !== 0) {*/}
        {/*vaccine.setVaccineError(error_list);*/}
        {/*return;*/}
        {/*}*/}
        {/*workWithServer.setOneVaccine({*/}
        {/*'data': vaccine.objectVaccineModal*/}
        {/*}).then(data => {*/}
        {/*vaccine.setListOfVaccine(data.vaccine);*/}
        {/*});*/}
        {/*vaccine.setShowVaccine(false);*/}
        {/*}}/>*/}
        {/*</div>*/}
        {/*{*/}
        {/*!!vaccine.objectVaccineModal.id && <>*/}
        {/*< div className="w-1/2 ml-1 flex">*/}
        {/*<Button*/}
        {/*className="my-4 mx-0 w-full text-center"*/}
        {/*type="danger"*/}
        {/*text="Удалить"*/}
        {/*onClick={() => {*/}
        {/*workWithServer.setOneVaccine({*/}
        {/*'data': vaccine.objectVaccineModal,*/}
        {/*'remove': true*/}
        {/*}).then(data => {*/}
        {/*vaccine.setListOfVaccine(data.vaccine);*/}
        {/*});*/}
        {/*vaccine.setShowVaccine(false);*/}
        {/*}}*/}
        {/*/>*/}
        {/*</div>*/}
        {/*</>*/}
        {/*}*/}
        {/*</div>*/}
        {/*}*/}
      </MyModal>
  )
}
