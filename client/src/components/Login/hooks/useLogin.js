//core
import {useEffect, useState} from 'react'

//functions
import workWithServer from '../../../core/workWithServer'

export function useLogin() {
    const [name, setName] = useState('');
    const [validName, setValidName] = useState(true);
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState(true);
    const [localLoader, setLocalLoader] = useState(false);

    const login = (e) => {
        e.preventDefault();
        setLocalLoader(true);
        const validName = name.length > 0;
        const validPassword = password.length > 0;
        setValidName(validName);
        setValidPassword(validPassword);

        if (validName && validPassword) {

            workWithServer.login({
                "username": name,
                "password": password
            }).then((data) => {
                if (!!data['error']) {
                    setValidName(false);
                    setLocalLoader(false);
                }
                if (!!data['refresh']) {
                    document.location.href = '/';
                }
            }).catch(() => {
                setValidName(false);
                setLocalLoader(false)
            })
        }
    };

    return {
        name : {
            name, setName, validName, setValidName
        },
        password: {
            password, setPassword, validPassword, setValidPassword
        },
        loader: {
            localLoader, setLocalLoader
        },
        login
    }
}