"use client";

import { addDays, format, getDay, parse, subDays } from "date-fns";
import { ko } from "date-fns/locale";
import { useRouter } from "next/navigation";
import styles from "./TaskPagination.module.scss";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { getClinicInfoData } from "@/service/getClinicInfoData";
import { useQuery } from "@tanstack/react-query";
import { ClinicInfoData } from "@/types/clinic";
type Props = {
  searchParams: { date: string };
};

const TaskPagination = ({ searchParams }: Props) => {
  const router = useRouter();
  const dateFormat = "yyyyMMdd";
  const todayDate = format(new Date(), dateFormat);
  const currentDate = parse(searchParams.date, dateFormat, new Date());

  const { data: clinicInfoData } = useQuery<ClinicInfoData>({
    queryKey: ["clinicInfo"],
    queryFn: getClinicInfoData,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  const clinicHoliday = clinicInfoData?.clinicSchedule
    .filter((schedule) => schedule.isClosed)
    .map((item) => format(item.workDate, dateFormat));

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
    <div className={styles.datePaginationWrap}>
      <button className={styles.prevButton} onClick={handlePrevDate}>
        <FaArrowAltCircleLeft />
      </button>
      <div className={styles.datePaginationButtons}>
        {dates.map((date, index) => {
          const parsedDate = parse(date, dateFormat, new Date());
          const isSunday = getDay(parsedDate) === 0;
          const dayOfWeek = format(parsedDate, "eee", { locale: ko });
          const isHoliday = clinicHoliday?.includes(date);
          return (
            <div
              key={index}
              className={`${styles.dateArea} ${
                searchParams.date === date ? styles.currentDate : ""
              } ${isSunday || isHoliday ? styles.holiday : ""}`}
            >
              <p className={styles.dayOfWeek}>{dayOfWeek}</p>
              <button onClick={() => handleMoveDate(date)}>
                {date.slice(-2)}
              </button>
              {date === todayDate ? (
                <div className={styles.today}>오늘</div>
              ) : null}
              {isSunday || isHoliday ? (
                <div className={styles.holiday}>휴무일</div>
              ) : null}
            </div>
          );
        })}
      </div>
      <button className={styles.nextButton} onClick={handleNextDate}>
        <FaArrowAltCircleRight />
      </button>
    </div>
  );
};

export default TaskPagination;
