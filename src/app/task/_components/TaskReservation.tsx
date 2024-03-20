"use client";

import { MouseEventHandler, useEffect, useMemo, useRef } from "react";

import styles from "./TaskReservation.module.scss";
import getHours from "@/utils/getHours";
import { useQueries, useQuery } from "@tanstack/react-query";
import { getTaskData } from "@/service/getTaskData";
import { TaskData } from "@/types/task";
import { getClinicBusinessTimeDate } from "@/service/getClinicBusinessTimeData";

const MIN_WIDTH = 100;

const TaskReservation = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const [TaskData, businessTimeData] = useQueries({
    queries: [
      {
        queryKey: ["task"],
        queryFn: getTaskData,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
      },
      {
        queryKey: ["business"],
        queryFn: getClinicBusinessTimeDate,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
      },
    ],
  });

  console.log(TaskData);

  const hours = useMemo(() => {
    if (
      businessTimeData.data?.businessStartTime ||
      businessTimeData.data?.businessEndTime
    ) {
      const startTime = parseInt(businessTimeData.data?.businessStartTime);
      const endTime = parseInt(businessTimeData.data?.businessEndTime);

      return getHours(startTime, endTime);
    }
    return getHours();
  }, [
    businessTimeData.data?.businessEndTime,
    businessTimeData.data?.businessStartTime,
  ]);

  useEffect(() => {
    if (parentRef.current) {
      const children = Array.from(parentRef.current.children) as HTMLElement[];
      for (let i = 0; i < children.length; i++) {
        if (i < children.length) {
          console.log(children[i].clientWidth);
          children[i].style.width = `${children[i].clientWidth / 10}rem`;
          children[i].style.flex = "0 1 auto";
        }
      }
    }
  }, []);

  const dragHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget.parentElement;

    if (!target) return;

    const initialLeft = target.getBoundingClientRect().left;

    const resize: EventListener = (e) => {
      const left = (e as MouseEvent).clientX;
      const width = Math.max(MIN_WIDTH, left - initialLeft);
      target.style.width = `${width / 10}rem`;
      target.style.flex = "0 1 auto";

      console.log(initialLeft, left, width);
    };

    document.addEventListener("mousemove", resize);
    document.addEventListener(
      "mouseup",
      () => document.removeEventListener("mousemove", resize),
      { once: true }
    );
  };

  return (
    <div className={styles.reservationWrap}>
      <div className={styles.reservationTaskArea}>
        <div ref={parentRef} className={styles.reservationTaskHeaderContent}>
          <div className={styles.taskHeader}>
            <span>예약</span>
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
          </div>
          <div className={styles.taskHeader}>
            <span>접수</span>
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
          </div>
          <div className={styles.taskHeader}>
            <span>검사</span>
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
          </div>
          <div className={styles.taskHeader}>
            <span>진료</span>
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
            <div className={styles.subTaskHeaderArea}>
              <div className={styles.subTaskHeader}>
                <span>의사1</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>의사2</span>
              </div>
            </div>
          </div>
          <div className={styles.taskHeader}>
            <span>치료</span>
            <div
              onMouseDown={dragHandler}
              className={styles.resizeDragArea}
            ></div>
            <div className={styles.subTaskHeaderArea}>
              <div className={styles.subTaskHeader}>
                <span>원적외선</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>온열</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>VIP 1</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>VIP 2</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>VIP 3</span>
              </div>
              <div className={styles.subTaskHeader}>
                <span>VIP 4</span>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.reservationTaskBodyContent}>
          <div className={styles.reservationTimeArea}>
            {hours.map((hour, index) => (
              <div key={index} className={styles.reservationTime}>
                {hour}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskReservation;
