"use client";

import { format, parse } from "date-fns";
import styles from "./TaskHeader.module.scss";
import Link from "next/link";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

type Props = {
  searchParams: { date: string };
};

const TaskHeader = ({ searchParams }: Props) => {
  const router = useRouter();
  const initialDate = searchParams.date || format(new Date(), "yyyyMMdd");
  const currentDate = parse(initialDate, "yyyyMMdd", new Date());
  const formattedDate = format(currentDate, "yyyy년 MM월 dd일");

  const handleTodayMove = () => {
    const newDate = new Date();
    const formattedNewDate = format(newDate, "yyyyMMdd");
    router.replace(`?date=${formattedNewDate}`);
  };
  return (
    <>
      <div className={styles.headerWrap}>
        <Link href="/">
          <FaArrowAltCircleLeft />
        </Link>
        <h2 className={styles.selectedDate}>{formattedDate}</h2>
        <button className={styles.todayBtn} onClick={handleTodayMove}>
          오늘
        </button>
      </div>
    </>
  );
};

export default TaskHeader;
