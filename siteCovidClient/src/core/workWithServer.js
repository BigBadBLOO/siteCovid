const workWithServer = () => {
  return {
    initUser: () => {
      return requestPost('/initUser/')
    },
    login: (data) => {
      return requestPost('/login/', data)
    },
    logOut: () => {
      return requestPost('/logout/',)
    },
    getListOfCity: () => {
      return requestPost('/getListOfCity/',)
    },
    getListOfPerson: () => {
      return requestPost('/getListOfPerson/',)
    },
    setListOfPerson: (data) => {
      return requestPost('/setListOfPerson/', data)
    },
    getListOfStatus: () => {
      return requestPost('/getListOfStatus/')
    },
    setListOfReport: (data) => {
      return requestPost('/setListOfReport/', data)
    },
    getListOfReport: (data) => {
      return requestPost('/getListOfReport/', data)
    },
    getListOfRank: (data) => {
      return requestPost('/getListOfRank/', data)
    },
    getListOfGroup: (data) => {
      return requestPost('/getListOfGroup/', data)
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
  return await fetch(url, body).then(status);
}

async function requestPost(url, data) {
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    'X-Requested-With': 'XMLHttpRequest',
  };
  let csrfmiddlewaretoken = getCookie('csrftoken');
  csrfmiddlewaretoken && (headers['X-CSRFToken'] = csrfmiddlewaretoken);
  return await request(url, {
    credentials: 'include',
    method: 'POST',
    mode: 'same-origin',
    headers: headers,
    body: JSON.stringify(data)
  })
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([.$?*|{}()[]\/+^])/g, '\\$1') + "=([^;]*)"
  ))
  return matches ? decodeURIComponent(matches[1]) : undefined
}

const setCookie = (name, value, props = {'Path': '/', maxAge: 1800}) => {
  let exp = props.expires
  if (typeof exp == "number" && exp) {
    let d = new Date()
    d.setTime(d.getTime() + exp * 1000)
    exp = props.expires = d
  }
  if (exp && exp.toUTCString) {
    props.expires = exp.toUTCString()
  }

  value = encodeURIComponent(value)
  let updatedCookie = name + "=" + value

  for (let propName in props) {
    updatedCookie += "; " + propName
    let propValue = props[propName]
    if (propValue !== true) {
      updatedCookie += "=" + propValue
    }
  }

  document.cookie = updatedCookie
}

export {setCookie}