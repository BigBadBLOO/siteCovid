import React, {useState} from 'react'
import MyModal from "./Modal";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import Button from "./Button";
import './workWithDB.css'

export default function WorkWithDB() {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Button className="" type='warning' text="Загрузить данные" onClick={() => {
        setShowModal(true)
      }}/>
      <MyModal show={showModal} showModal={setShowModal}>
        <div className="border-b m-1 mb-4 p-2 flex">
          <span className="my-auto">База данных</span>
          <span className="ml-auto cursor-pointer" onClick={() => setShowModal(false)}>x</span>
        </div>
        <Tabs className="mt-4">
          <TabList className="flex overflow-x-hidden cursor-pointer">
            <Tab className="p-2 outline-none truncate w-1/2 text-center border-b">Скачать данные</Tab>
            <Tab className="p-2 outline-none truncate w-1/2 text-center border-b">Загрузить данные</Tab>
          </TabList>

          <TabPanel>
            <Button type="success" text="Скачать"/>
          </TabPanel>
          <TabPanel>
            <Button type="success" text="Загрузить"/>
          </TabPanel>
        </Tabs>
      </MyModal>
    </>
  )
}