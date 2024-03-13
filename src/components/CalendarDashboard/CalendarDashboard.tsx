"use client";

import useCalendar from "@/hooks/useCalendar";
import {
  ReactNode,
  createContext,
  useContext,
  MouseEvent,
  useState,
  useEffect,
  useCallback,
} from "react";
import { addMonths, format, isToday, setDate, subMonths } from "date-fns";
import styles from "./CalendarDashboard.module.scss";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/useToast";
import { FaArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getCalendarData } from "@/service/getCalendarData";
import { CalendarData } from "@/types/calendar";
import useDialog from "@/hooks/useDialog";

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
        <button onClick={prevMonthMove}>
          <FaArrowAltCircleLeft />
        </button>
        <h3>{format(currentDate, "yyyy년 M월")}</h3>
        <button onClick={nextMonthMove}>
          <FaArrowAltCircleRight />
        </button>
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
  const { weekCalendarList, currentDate } = useCalendarContext();
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [showMemoBox, setShowMemoBox] = useState(true);
  const { data: calendarData } = useQuery<CalendarData[]>({
    queryKey: ["calendar"],
    queryFn: getCalendarData,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  const router = useRouter();
  const { showToast } = useToast();

  const handleCtrlClick = (e: MouseEvent<HTMLDivElement>, date: Date) => {
    setShowMemoBox(false);

    if (e.ctrlKey || e.metaKey) {
      const isSelected = selectedDates.some(
        (selectedDate) =>
          selectedDate.getDate() === date.getDate() &&
          selectedDate.getMonth() === date.getMonth() &&
          selectedDate.getFullYear() === date.getFullYear()
      );

      if (isSelected) {
        setSelectedDates(
          selectedDates.filter(
            (selectedDate) =>
              selectedDate.getDate() !== date.getDate() ||
              selectedDate.getMonth() !== date.getMonth() ||
              selectedDate.getFullYear() !== date.getFullYear()
          )
        );
      } else if (selectedDates.length < 5) {
        setSelectedDates([...selectedDates, date]);
      } else {
        showToast("error", "최대 5일간 일정만 볼 수 있습니다.");
        setSelectedDates([]);
      }
    } else {
      const newSelectedDates = date === selectedDates[0] ? [] : [date];
      setSelectedDates(newSelectedDates);

      const formattedDates = newSelectedDates.map((date) =>
        format(date, "yyyy-MM-dd")
      );

      showToast("success", `${formattedDates.join(", ")} 일정으로 이동합니다.`);

      const targetDate = formattedDates[0].replace(/-/g, "");
      router.push(`/task?date=${targetDate}`);
    }
  };

  const handleCtrlRelease = useCallback(
    (e: KeyboardEvent) => {
      setShowMemoBox(true);
      const formattedDates = selectedDates.map((date) =>
        format(date, "yyyy-MM-dd")
      );
      if (
        (e.key === "Control" || e.key === "Meta") &&
        selectedDates.length === 1
      ) {
        const targetDate = formattedDates[0].replace(/-/g, "");
        router.push(`/task?date=${targetDate}`);

        showToast(
          "success",
          `${formattedDates.join(", ")} 일정으로 이동합니다.`
        );
      } else if (
        (e.key === "Control" || e.key === "Meta") &&
        selectedDates.length > 1
      ) {
        router.push(`/tasks`);
        showToast(
          "success",
          `${formattedDates.join(", ")} 일정으로 이동합니다.`
        );
      }
    },
    [selectedDates, router, showToast]
  );

  useEffect(() => {
    document.onkeyup = handleCtrlRelease;
    return () => {
      document.onkeyup = null;
    };
  }, [handleCtrlRelease]);

  return (
    <div className={styles.body}>
      {weekCalendarList.map((week, i) => (
        <div key={i} className={`${styles.row}`}>
          {week.map((day, j) => {
            if (day === 0) {
              return (
                <div key={j} className={`${styles.col} ${styles.hidden}`}></div>
              );
            }

            const date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );
            const isCurrentDay = isToday(date);
            const isSelected = selectedDates.some(
              (selectedDate) =>
                selectedDate.getDate() === date.getDate() &&
                selectedDate.getMonth() === date.getMonth() &&
                selectedDate.getFullYear() === date.getFullYear()
            );

            const dateData = calendarData?.find(
              (data) =>
                format(new Date(data.date), "yyyy-MM-dd") ===
                format(date, "yyyy-MM-dd")
            );

            const isCloseDays = calendarData
              ?.filter((data) => data.isClosed)
              .some(
                (closeDay) =>
                  format(new Date(closeDay.date), "yyyy-MM-dd") ===
                  format(date, "yyyy-MM-dd")
              );

            return (
              <div
                key={j}
                onClick={(e) => handleCtrlClick(e, date)}
                className={`${styles.col} ${
                  j === 0 || isCloseDays
                    ? styles.sunday
                    : j === 6
                    ? styles.saturday
                    : ""
                } ${isSelected ? styles.selected : ""}`}
              >
                <span
                  className={`${isCurrentDay ? styles.today : ""} ${
                    styles.day
                  }`}
                >
                  {day}
                </span>
                {dateData && (
                  <div className={styles.calendarDataArea}>
                    {dateData.memo.length > 0 && showMemoBox && (
                      <div className={styles.hoverBox}>
                        {dateData.memo.map((memo) => (
                          <div key={memo.id}>{memo.text}</div>
                        ))}
                      </div>
                    )}
                    <div className={styles.memoArea}>
                      {dateData.memo.map((memo) => (
                        <div key={memo.id}>{memo.text}</div>
                      ))}
                    </div>
                    <div className={styles.reservationInfoArea}>
                      <div>
                        예약{" "}
                        <span
                          className={`${
                            dateData.reservation !== 0 ? styles.reservation : ""
                          }`}
                        >
                          {dateData.reservation}
                        </span>
                      </div>
                      <div>
                        취소{" "}
                        <span
                          className={`${
                            dateData.canceled !== 0 ? styles.canceled : ""
                          }`}
                        >
                          {dateData.canceled}
                        </span>
                      </div>
                      <div>
                        노쇼{" "}
                        <span
                          className={`${
                            dateData.noShow !== 0 ? styles.noShow : ""
                          }`}
                        >
                          {dateData.noShow}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

CalendarDashboard.Header = CalendarHeader;
CalendarDashboard.Days = CalenderDays;
CalendarDashboard.Body = CalendarBody;
