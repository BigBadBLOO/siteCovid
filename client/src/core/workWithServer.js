//core
import {trackPromise} from "react-promise-tracker";

//functions
import {
    GET_DUTY_INFO, GET_LIST_OF_CITY, GET_LIST_OF_PERSON, GET_LIST_OF_REPORT, GET_OVERTIME, INIT_MAIN_INFO, INIT_USER
} from "./mockServerData";

const workWithServer = () => {
    const workWithMockData = false;

    const url_server = window.location.hostname === 'localhost' ? 'http://localhost:8000' : window.location.origin;
    // const url_server = 'http://web:2019';
    return {
        initUser: () => {
            if (workWithMockData) {
                return Promise.resolve(INIT_USER);
            }
            return requestPost(url_server + '/initUser/')
        },
        initMainInfo: () => {
            if (workWithMockData) {
                return Promise.resolve(INIT_MAIN_INFO);
            }
            return requestPost(url_server + '/initMainInfo/')
        },
        getListOfPerson: () => {
            if (workWithMockData) {
                return Promise.resolve(GET_LIST_OF_PERSON);
            }
            return requestPost(url_server + '/getListOfPerson/',)
        },
        getListOfAllPerson: () => {
            if (workWithMockData) {
                return Promise.resolve(GET_LIST_OF_PERSON);
            }
            return requestPost(url_server + '/getListOfAllPerson/',)
        },
        getListOfReport: (data) => {
            if (workWithMockData) {
                return Promise.resolve(GET_LIST_OF_REPORT);
            }
            return requestPost(url_server + '/getListOfReport/', data)
        },

        login: (data) => {
            return requestPost(url_server + '/login/', data)
        },
        logOut: () => {
            return requestPost(url_server + '/logout/',)
        },
        changePassword: (data) => {
            return requestPost(url_server + '/changePassword/', data)
        },
        getListOfCity: () => {
            if (workWithMockData) {
                return Promise.resolve(GET_LIST_OF_CITY);
            }
            return requestPost(url_server + '/getListOfCity/',)
        },
        getNameStatus: (data) => {
            return requestPost(url_server + '/getNameStatus/', data)
        },
        getEmailStatus: (data) => {
            return requestPost(url_server + '/getEmailStatus/', data)
        },
        setListOfPerson: (data) => {
            return requestPost(url_server + '/setListOfPerson/', data)
        },
        setCountByGroup: (data) => {
            return requestPost(url_server + '/setCountByGroup/', data)
        },
        setListOfReport: (data) => {
            return requestPost(url_server + '/setListOfReport/', data)
        },
        setOneReport: (data) => {
            return requestPost(url_server + '/setOneReport/', data)
        },
        setOneVaccine: (data) => {
            return requestPost(url_server + '/setOneVaccine/', data)
        },
        setOneAntitela: (data) => {
            return requestPost(url_server + '/setOneAntitela/', data)
        },
        getExtraFieldsForStatus: (data) => {
            return requestPost(url_server + '/getExtraFieldsForStatus/', data)
        },
        getListOfPost: () => {
            return requestPost(url_server + '/getListOfPost/')
        },
        setListOfPost: (data) => {
            return requestPost(url_server + '/setListOfPost/', data)
        },
        dumpDB: () => {
            return requestPost(url_server + '/db/dump/')
        },
        loadDB: (form) => {
            return requestPostFile(url_server + '/db/load/', form)
        },
        setDutyInfo: (data) => {
            if (workWithMockData) {
                return Promise.resolve({});
            }
            return requestPost(url_server + '/setDutyInfo/', data)
        },
        getDutyInfo: (data) => {
            if (workWithMockData) {
                return Promise.resolve(GET_DUTY_INFO)
            }
            return requestPost(url_server + '/getDutyInfo/', data)
        },
        setPersonStatusByDuty: (data) => {
            return requestPost(url_server + '/setPersonStatusByDuty/', data)
        },
        downloadDutyExcel: (data) => {
            return requestPost(url_server + '/downloadDutyExcel/', data)
        },
        getOvertime: (data) => {
            if (workWithMockData) {
                return Promise.resolve(GET_OVERTIME)
            }
            return requestPost(url_server + '/getOvertime/', data)
        },
        setOvertime: (data) => {
            return requestPost(url_server + '/setOvertime/', data)
        },
        request_overtime: (data) => {
            return requestPost(url_server + '/request_overtime/', data)
        },
        set_user_to_work: (data) => {
            return requestPost(url_server + '/set_user_to_work/', data)
        },

    }
};

export default workWithServer()

function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response.json())
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

async function request(url, body) {
    return await trackPromise(fetch(url, body).then(status));
}

async function requestPost(url, data, stringify = true) {
    const headers = {
        'Accept': 'application/json',
        "content-type": "application/json",
        'X-Requested-With': 'XMLHttpRequest',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*'

    };
    let csrfmiddlewaretoken = getCookie('csrftoken');
    csrfmiddlewaretoken && (headers['X-CSRFToken'] = csrfmiddlewaretoken);
    return await request(url, {
        credentials: 'include',
        withCredentials: true,
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: stringify ? JSON.stringify(data) : data
    })
}

async function requestPostFile(url, form) {
    const headers = {
        // 'Content-Type': 'application/json; multipart/form-data',
        // 'X-Requested-With': 'XMLHttpRequest'
    };
    let csrfmiddlewaretoken = getCookie('csrftoken');
    csrfmiddlewaretoken && (headers['X-CSRFToken'] = csrfmiddlewaretoken);

    return await request(url, {
        credentials: 'include',
        method: 'POST',
        mode: 'cors',
        headers: headers,
        body: form
    })
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([.$?*|{}()[]\/+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined
}

const setCookie = (name, value, props = {'Path': '/', maxAge: 1800}) => {
    let exp = props.expires;
    if (typeof exp === "number" && exp) {
        let d = new Date();
        d.setTime(d.getTime() + exp * 1000);
        exp = props.expires = d
    }
    if (exp && exp.toUTCString) {
        props.expires = exp.toUTCString()
    }

    value = encodeURIComponent(value);
    let updatedCookie = name + "=" + value;

    for (let propName in props) {
        updatedCookie += "; " + propName;
        let propValue = props[propName];
        if (propValue !== true) {
            updatedCookie += "=" + propValue
        }
    }

    document.cookie = updatedCookie
}

export {setCookie}