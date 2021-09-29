//core
import {useEffect, useState} from 'react'

export function useReload() {
    const [myReload, setMyReload] = useState(0);
    const [myTimeout, setMyTimeout] = useState(false);
    const [isBlur, setIsBlur] = useState(false);


    useEffect(() => {
        let counterTimeout = 0;
        const IDLE_TIMEOUT = 5;

        function reset_counter_TIMEOUT() {
            setMyTimeout(false);
            counterTimeout = 0;
        }

        function check_counter_TIMEOUT() {
            counterTimeout++;
            if (counterTimeout >= (isBlur ? 2 : IDLE_TIMEOUT)) {
                setMyTimeout(true);
                if (!isBlur) {
                    reset_counter_TIMEOUT();
                }
            }
        }

        window.onclick = reset_counter_TIMEOUT;
        window.onmousemove = reset_counter_TIMEOUT;
        window.onkeypress = reset_counter_TIMEOUT;
        window.onfocus = function () {
            setIsBlur(false);
            if (!myTimeout) {
                setMyTimeout(true);
            }
        };
        window.onblur = function () {
            setIsBlur(true);
        };

        setInterval(check_counter_TIMEOUT, 300000);
    }, []);

    useEffect(() => {
        !isBlur && myTimeout && setMyReload(myReload + 1)
    }, [myTimeout, isBlur]);

    return {
        myReload
    }
}



