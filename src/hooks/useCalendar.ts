import { getDaysInMonth, subMonths } from "date-fns";
import React from "react";

const DATE_MONTH_FIXER = 0;
const CALENDER_LENGTH = 35;
const DEFAULT_TRASH_VALUE = 0;
const DAY_OF_WEEK = 7;
const DAY_LIST = ["일", "월", "화", "수", "목", "금", "토"];

const useCalendar = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const totalMonthDays = getDaysInMonth(currentDate);

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const prevDayList = Array.from({
    length: Math.max(0, firstDayOfMonth.getDay()),
  }).map(() => DEFAULT_TRASH_VALUE);

  const currentDayList = Array.from({ length: totalMonthDays }).map(
    (_, i) => i + 1
  );
  const nextDayList = Array.from({
    length: CALENDER_LENGTH - currentDayList.length - prevDayList.length,
  }).map(() => DEFAULT_TRASH_VALUE);

  const currentCalendarList = prevDayList.concat(currentDayList, nextDayList);
  const weekCalendarList = currentCalendarList.reduce(
    (acc: number[][], cur, idx) => {
      const weekIndex = Math.floor(idx / DAY_OF_WEEK);
      if (!acc[weekIndex]) {
        acc[weekIndex] = [];
      }
      acc[weekIndex].push(cur);

      return acc;
    },
    []
  );

  while (weekCalendarList[weekCalendarList.length - 1].length < 7) {
    weekCalendarList[weekCalendarList.length - 1].push(DEFAULT_TRASH_VALUE);
  }

  return {
    weekCalendarList: weekCalendarList,
    currentDate: currentDate,
    setCurrentDate: setCurrentDate,
  };
};
export default useCalendar;
