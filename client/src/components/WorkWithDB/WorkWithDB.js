//core
import React, {useState, createRef} from 'react'
import moment from "moment";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";

//components
import MyModal from "../modal/Modal";
import Button from "../Button";

//functions
import workWithServer from "../../core/workWithServer";

//styles
import './workWithDB.css'


export default function WorkWithDB({setReport}) {
    const [showModal, setShowModal] = useState(false);
    const refFileInput = createRef();

    const saveFile = () => {
        workWithServer.dumpDB().then(tab_text => {
            try {
                let a = document.createElement('a');
                a.href = tab_text.filename;
                a.download = moment(new Date()).format('YYYY-MM-DD') + '.json';
                a.type = 'hidden';
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
            catch (e) {
                window.open(tab_text.filename);
            }

        })
    };
    const loadFile = () => {
        const form = new FormData();
        form.append('file', refFileInput.current.files[0]);
        workWithServer.loadDB(form).then(() => {
            !!setReport && setReport();
            setShowModal(false)
        })
    };

    return (
        <>
            <Button className="" type='warning' text="База данных" onClick={() => {
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
                        <div className="flex">
                            <Button className="mx-auto" type="success" text="Скачать" onClick={saveFile}/>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="flex">
                            <input id="file" ref={refFileInput} className="m-2" type='file'/>
                            <Button className="ml-auto" type="success" text="Загрузить" onClick={loadFile}/>
                        </div>
                    </TabPanel>
                </Tabs>
            </MyModal>
        </>
    )
}