//core
import {useEffect, useState} from 'react'

export function useDate() {
    const curr = new Date();
    const firstDay = new Date(curr.getFullYear(), curr.getMonth(), 1, 5);
    const lastDay = new Date(curr.getFullYear(), curr.getMonth() + 1, 0, 5);

    const [currDate, setCurrDate] = useState(curr);
    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(lastDay);

    return {
        curr,
        currDate,
        setCurrDate,
        startDate,
        setStartDate,
        endDate,
        setEndDate
    }
}
