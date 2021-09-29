/**
 * Created by agapov_ev on 24.06.2021.
 */
//core
import React from 'react'
// import { usePromiseTracker } from "react-promise-tracker";

export default function Info({user}) {
  return (
    <div className="fixed h-screen w-screen text-center">
      <p className="p-4">Уважаемый {user.first_name}</p>
        <p className="m-10">
            Для доступа к личной информации в системе "Журнал учета личного состава" <br/>
            обратитесь к сотруднику ответственному за работу с системой в вашем подразделении<br/>
            и попросите его указать ваш адрес внутренней электронной почты в разделе "Управление л/с"
        </p>
        <br/>

    </div>
  )
}