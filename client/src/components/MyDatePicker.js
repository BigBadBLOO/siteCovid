//core
import React from 'react'
import DatePicker from "react-datepicker";
import {registerLocale} from "react-datepicker";
import ru from "date-fns/locale/ru";

//components
import Button, {InputForDatePicker} from "./Button";

registerLocale("ru", ru);

export function MyDatePicker({curr, currDate, setCurrDate, setStartDate, setEndDate}) {
    return <>
        <Button className="mr-0 rounded-l-md rounded-r-none" type='primary' text="<" onClick={() => {
            currDate.setDate(1);
            const curr_d = new Date(currDate.setMonth(currDate.getMonth() - 1));
            setCurrDate(curr_d);
            setStartDate(new Date(curr_d.getFullYear(), curr_d.getMonth(), 1, 5));
            setEndDate(new Date(curr_d.getFullYear(), curr_d.getMonth() + 1, 0, 5));
        }}/>

        <DatePicker
            className="w-16 my-2 mx-0 border-blue-700 rounded-none border-b border-t"
            selected={currDate}
            onChange={date => {
                const curr_d = new Date(date);
                setCurrDate(curr_d);
                setStartDate(new Date(curr_d.getFullYear(), curr_d.getMonth(), 1, 5));
                setEndDate(new Date(curr_d.getFullYear(), curr_d.getMonth() + 1, 0, 5));
            }}
            dateFormat="MM.yy"
            customInput={<InputForDatePicker/>}
            showMonthYearPicker
            showFullMonthYearPicker
            locale="ru"
        />

        <Button className="ml-0 rounded-r-md rounded-l-none" type='primary' text=">" onClick={() => {
            currDate.setDate(1);
            const curr_d = new Date(currDate.setMonth(currDate.getMonth() + 1));
            setCurrDate(curr_d);
            setStartDate(new Date(curr_d.getFullYear(), curr_d.getMonth(), 1, 5));
            setEndDate(new Date(curr_d.getFullYear(), curr_d.getMonth() + 1, 0, 5));
        }}/>

        {(currDate.getFullYear() !== curr.getFullYear() || currDate.getMonth() !== curr.getMonth())
        && <Button className="" type='primary' text="К текущему месяцу" onClick={() => {
            setCurrDate(curr);
            setStartDate(new Date(curr.getFullYear(), curr.getMonth(), 1, 5));
            setEndDate(new Date(curr.getFullYear(), curr.getMonth() + 1, 0, 5));
        }}/>}
    </>
}
