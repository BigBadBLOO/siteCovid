import {get_two} from "./localWorkWithNumber";

const human_month = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const human_month_im = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];

// const weeker = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
//
// const weeker_count = {
//     1: ['первый', 'второй', 'третий', 'четвёртый', 'пятый', 'предпоследний', 'последний'],
//     2: ['первый', 'второй', 'третий', 'четвёртый', 'пятый', 'предпоследний', 'последний'],
//     3: ['первая', 'вторая', 'третья', 'четвёртая', 'пятая', 'предпоследная', 'последняя'],
//     4: ['первый', 'второй', 'третий', 'четвёртый', 'пятый', 'предпоследний', 'последний'],
//     5: ['первая', 'вторая', 'третья', 'четвёртая', 'пятая', 'предпоследная', 'последняя'],
//     6: ['первая', 'вторая', 'третья', 'четвёртая', 'пятая', 'предпоследная', 'последняя'],
//     7: ['первое', 'второе', 'третье', 'четвёртое', 'пятое', 'предпоследнее', 'последнее'],
// };
//
// const human_month_rev = {
//     'января': 1,
//     'февраля': 2,
//     'марта': 3,
//     'апреля': 4,
//     'мая': 5,
//     'июня': 6,
//     'июля': 7,
//     'августа': 8,
//     'сентября': 9,
//     'октября': 10,
//     'ноября': 11,
//     'декабря': 12
// };
//
// const short_weeker = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

export function get_human_month_im(number) {
  return human_month_im[number];
}

export function from_date_format(date) {
  if (!!date) {
    date = new Date(date);
    date = get_two(date.getDate()) + '.' + get_two(date.getMonth() + 1) + '.' + date.getFullYear();
  } else {
    date = '';
  }
  return date;
}

export function from_date_format_st(date) {
  if (!!date) {
    date = new Date(date);
    date = get_two(date.getDate()) + '.' + get_two(date.getMonth() + 1) + '.' + (date.getFullYear() % 100);
  } else {
    date = '';
  }
  return date;
}

export function from_date_format_short(date) {
  if (!!date) {
    date = new Date(date);
    date = get_two(date.getDate()) + '.' + get_two(date.getMonth() + 1);
  } else {
    date = '';
  }
  return date;
}

export function from_date_format_hm(date) {
  if (!!date) {
    date = new Date(date);
    date = get_two(date.getDate()) + ' ' + human_month[date.getMonth()] + ' ' + date.getFullYear();
  } else {
    date = '';
  }
  return date;
}


export function compareDate(date1, date2, delta) {
  delta = delta || {};

  date1 = new Date(date1);
  date2 = new Date(date2);
  delta.day = delta.day || 0;
  delta.month = delta.month || 0;
  delta.year = delta.year || 0;

  date2 = new Date(date2.setFullYear(date2.getFullYear() - delta.year));
  date2 = new Date(date2.setMonth(date2.getMonth() - delta.month));
  date2 = new Date(date2.setDate(date2.getDate() - delta.day));

  if (date1.getFullYear() === date2.getFullYear()) {
    if (date1.getMonth() === date2.getMonth()) {
      if (date1.getDate() === date2.getDate()) {
        return 0;
      }
      return date1.getDate() < date2.getDate() ? -1 : 1;
    }
    return date1.getMonth() < date2.getMonth() ? -1 : 1;
  }
  return date1.getFullYear() < date2.getFullYear() ? -1 : 1;
}

export function isHoliday(day, listOfHolidays) {
  let inList = !!listOfHolidays && listOfHolidays.find(el => {
    return (day.getMonth() + 1) === el.month && day.getDate() === el.day
  });
  return inList ? inList.chill : null;
}


export function isWeekends(date) {
  return (date.getDay() === 0 || date.getDay() === 6)
}

export function isDayNotNormal(day, listOfHolidays) {
  let inHolidaysList = isHoliday(day, listOfHolidays);

  return inHolidaysList !== null ? inHolidaysList : isWeekends(day)
}

export function isDayFullyNotNormal(day, listOfHolidays) {
  let inHolidaysList = isHoliday(day, listOfHolidays);

  return inHolidaysList !== null ? inHolidaysList : day.getDay() === 0
}


export function isWorkDayShow(date1, date2, listOfHolidays) {
  let result = true;

  if (compareDate(date1, date2) >= 0) return true;

  if (isDayNotNormal(date2, listOfHolidays)) return false;

  while (result) {
    date1 = new Date(date1.setDate(date1.getDate() + 1));
    if (compareDate(date1, date2) === 0) {
      break;
    }
    if (!isDayNotNormal(date1, listOfHolidays)) {
      result = false;
    }
  }
  return result;
}

export function getWorkDayCountAll(start, end, listOfHolidays) {
  return getWorkDayCount(start, end, listOfHolidays, isDayNotNormal)
}

export function getWorkDayCountFully(start, end, listOfHolidays) {
  return getWorkDayCount(start, end, listOfHolidays, isDayFullyNotNormal)
}

function getWorkDayCount(start, end, listOfHolidays, func) {
  let result = 0;
  while (start <= end) {
    result += func(start, listOfHolidays) ? 0 : 1;
    start = new Date(start.setDate(start.getDate() + 1))
  }
  return result;
}