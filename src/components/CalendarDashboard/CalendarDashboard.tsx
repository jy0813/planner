"use client";

import useCalendar from "@/hooks/useCalendar";
import { ReactNode, createContext, useContext } from "react";
import { addMonths, format, subMonths } from "date-fns";
import styles from "./CalendarDashboard.module.scss";

type CalendarContextType = ReturnType<typeof useCalendar>;
const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const useCalendarContext = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      "useCalendarContext must be used within a CalendarProvider"
    );
  }
  return context;
};

export const CalendarDashboard = ({ children }: { children: ReactNode }) => {
  const calendar = useCalendar();
  return (
    <CalendarContext.Provider value={calendar}>
      <div className={styles.calendarDashboard}>{children}</div>
    </CalendarContext.Provider>
  );
};

const CalendarHeader = () => {
  const { currentDate, setCurrentDate } = useCalendarContext();

  const currentMonthMove = () => {
    setCurrentDate(new Date());
  };

  const prevMonthMove = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonthMove = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };
  return (
    <div className={styles.header}>
      <div className={styles.todayArea}>
        <h4>
          <button onClick={currentMonthMove}>
            <span className={styles.border}></span>오늘&nbsp;
            {format(new Date(), "yyyy-MM-dd")}
          </button>
        </h4>
      </div>
      <div className={styles.currentArea}>
        <button onClick={prevMonthMove}>이전</button>
        <h3>{format(currentDate, "yyyy년 M월")}</h3>
        <button onClick={nextMonthMove}>다음</button>
      </div>
    </div>
  );
};

const CalenderDays = () => {
  const DAY_LIST = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <div className={styles.nav}>
      {DAY_LIST.map((day, index) => (
        <div
          key={index}
          className={`${styles.col} ${
            day === "토" ? styles.saturday : day === "일" ? styles.sunday : ""
          }`}
        >
          {day}
        </div>
      ))}
    </div>
  );
};

const CalendarBody = () => {
  const { weekCalendarList } = useCalendarContext();

  return (
    <div className={styles.body}>
      {weekCalendarList.map((week, i) => (
        <div key={i} className={`${styles.row}`}>
          {week.map((day, j) => (
            <div
              key={j}
              className={`${styles.col} ${day === 0 ? styles.hidden : ""}`}
            >
              {day}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

CalendarDashboard.Header = CalendarHeader;
CalendarDashboard.Days = CalenderDays;
CalendarDashboard.Body = CalendarBody;
