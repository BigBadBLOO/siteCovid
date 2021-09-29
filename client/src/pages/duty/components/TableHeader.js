import React from 'react'

export default function TableHeader() {
    return (
        <thead>
        <tr className="text-center">
            <td className="border p-1">Дата</td>
            <td className="border p-1">Деж. по институту</td>
            <td className="border p-1">Первый пом. деж. по институту</td>
            <td className="border p-1">Второй пом. деж. по институту</td>
            <td className="border p-1">Третий пом. деж. по институту</td>
            <td className="border p-1">Четвертый пом. деж. по институту</td>
            <td className="border p-1">Дежурный по военной комендатуре</td>
            <td className="border p-1">Контролирующий элементы распорядка дня</td>
        </tr>

        </thead>
    )
}
