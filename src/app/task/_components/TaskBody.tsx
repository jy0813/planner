"use client";

import { addDays, format, getDay, parse, subDays } from "date-fns";
import { useRouter } from "next/navigation";
import styles from "./TaskBody.module.scss";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
type Props = {
  searchParams: { date: string };
};

const TaskBody = ({ searchParams }: Props) => {
  const router = useRouter();
  const dateFormat = "yyyyMMdd";
  const todayDate = format(new Date(), dateFormat);
  const currentDate = parse(searchParams.date, dateFormat, new Date());

  const dates = Array.from({ length: 15 }, (_, i) =>
    format(addDays(subDays(currentDate, 7), i), dateFormat)
  );

  const nextDate = format(addDays(currentDate, 1), dateFormat);
  const prevDate = format(subDays(currentDate, 1), dateFormat);

  const handleNextDate = () => {
    router.push(`?date=${nextDate}`);
  };

  const handlePrevDate = () => {
    router.push(`?date=${prevDate}`);
  };

  const handleMoveDate = (date: string) => {
    router.push(`?date=${date}`);
  };

  return (
    <div>
      <div className={styles.datePaginationWrap}>
        <button className={styles.prevButton} onClick={handlePrevDate}>
          <FaArrowAltCircleLeft />
        </button>
        <div className={styles.datePaginationButtons}>
          {dates.map((date, index) => {
            const parsedDate = parse(date, dateFormat, new Date());
            const isSunday = getDay(parsedDate) === 0;

            return (
              <div
                key={index}
                className={`${styles.dateArea} ${
                  searchParams.date === date ? styles.currentDate : ""
                } ${isSunday ? styles.holiday : ""}`}
              >
                <button onClick={() => handleMoveDate(date)}>
                  {date.slice(-2)}
                </button>
                {date === todayDate ? (
                  <div className={styles.today}>오늘</div>
                ) : null}
                {isSunday ? <div className={styles.holiday}>휴무일</div> : null}
              </div>
            );
          })}
        </div>
        <button className={styles.nextButton} onClick={handleNextDate}>
          <FaArrowAltCircleRight />
        </button>
      </div>
      <div className={styles.taskListWrap}>
        <div className={styles.col}>0</div>
        <div className={styles.col}>1</div>
        <div className={styles.col}>2</div>
        <div className={styles.col}>3</div>
        <div className={styles.col}>4</div>
        <div className={styles.col}>5</div>
        <div className={styles.col}>6</div>
      </div>
    </div>
  );
};

export default TaskBody;
