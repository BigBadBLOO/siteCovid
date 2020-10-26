import React from 'react'
import { usePromiseTracker } from "react-promise-tracker";

export default function Loader() {
  const { promiseInProgress } = usePromiseTracker();
  return (
    promiseInProgress &&
    <div id="loader" className="absolute h-screen w-screen bg-gray-400 bg-opacity-25 text-center flex top-0">
      <p className="m-auto bg-blue-600 text-white border rounded animate-pulse p-4">Идет загрузка данных...</p>
    </div>
  )
}